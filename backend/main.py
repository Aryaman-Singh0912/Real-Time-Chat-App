from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import UserCreate, UserLogin, ContactCreate, ConversationCreate, MessageCreate
from models import Users, Contact, Conversation, Message
from auth import hash_password, verify_password, create_access_token, decode_access_token
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import or_, and_
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "https://huddle-chat-app.vercel.app",  # your live Vercel site
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_json(message)

manager = ConnectionManager()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    username = payload.get("sub")
    user = db.query(Users).filter(Users.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.get("/conversations")
def get_conversations(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    conversations = db.query(Conversation).filter(
        or_(Conversation.user_one_id == current_user.id, Conversation.user_two_id == current_user.id)
    ).all()

    result = []
    for convo in conversations:
        other_id = convo.user_two_id if convo.user_one_id == current_user.id else convo.user_one_id
        other_user = db.query(Users).filter(Users.id == other_id).first()

        last_message = (
            db.query(Message)
            .filter(Message.conversation_id == convo.id)
            .order_by(Message.created_at.desc())
            .first()
        )

        result.append({
            "id": convo.id,
            "contact": {
                "id": other_user.id,
                "username": other_user.username, 
                "online": other_user.id in manager.active_connections,
                "last_seen": other_user.last_seen,
            },
            "last_message": last_message.content if last_message else None,
            "last_message_time": last_message.created_at if last_message else None,
        })

    return result

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(Users).filter(Users.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = Users(username=user.username, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"id": new_user.id, "username": new_user.username}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        await websocket.close(code=1008)
        return

    username = payload.get("sub")
    user = db.query(Users).filter(Users.username == username).first()
    if user is None:
        await websocket.close(code=1008)
        return

    await manager.connect(user.id, websocket) # type: ignore

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "typing":
                await manager.send_personal_message(
                    {"type": "typing", "sender_id": user.id},
                    data["receiver_id"]
                )
                continue

            new_message = Message(
                conversation_id=data["conversation_id"],
                sender_id=user.id,
                content=data["content"]
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            await manager.send_personal_message(
                {
                    "type": "message",
                    "id": new_message.id,
                    "conversation_id": new_message.conversation_id,
                    "sender_id": new_message.sender_id,
                    "content": new_message.content,
                    "created_at": str(new_message.created_at)
                },
                data["receiver_id"]
            )

    except WebSocketDisconnect:
        manager.disconnect(user.id) # type: ignore
        user.last_seen = datetime.now(timezone.utc) # type: ignore
        db.commit()
        
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password): # type: ignore
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/")
def root():
    return {"message" : "server is alive"}

@app.get("/me")
def read_current_user(current_user: Users = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username}

@app.get("/users/search")
def search_users(query: str, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(Users).filter(
        Users.username.ilike(f"%{query}%"),
        Users.id != current_user.id
    ).all()

    return [{"id": u.id, "username": u.username} for u in results]

@app.post("/contacts")
def add_contact(contact: ContactCreate, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    if contact.contact_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot add yourself as a contact")

    target_user = db.query(Users).filter(Users.id == contact.contact_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Contact).filter(
        Contact.owner_id == current_user.id,
        Contact.contact_id == contact.contact_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Contact already added")

    new_contact = Contact(owner_id=current_user.id, contact_id=contact.contact_id)
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return {"id": new_contact.id, "owner_id": new_contact.owner_id, "contact_id": new_contact.contact_id}

@app.post("/conversations")
def start_conversation(convo: ConversationCreate, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Conversation).filter(
        or_(
            and_(Conversation.user_one_id == current_user.id, Conversation.user_two_id == convo.other_user_id),
            and_(Conversation.user_one_id == convo.other_user_id, Conversation.user_two_id == current_user.id)
        )
    ).first()

    if existing:
        return {"id": existing.id, "user_one_id": existing.user_one_id, "user_two_id": existing.user_two_id}

    new_convo = Conversation(user_one_id=current_user.id, user_two_id=convo.other_user_id)
    db.add(new_convo)
    db.commit()
    db.refresh(new_convo)

    return {"id": new_convo.id, "user_one_id": new_convo.user_one_id, "user_two_id": new_convo.user_two_id}

@app.post("/messages")
def send_message(msg: MessageCreate, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = db.query(Conversation).filter(Conversation.id == msg.conversation_id).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if current_user.id not in [conversation.user_one_id, conversation.user_two_id]:
        raise HTTPException(status_code=403, detail="You are not part of this conversation")

    new_message = Message(
        conversation_id = msg.conversation_id,
        sender_id = current_user.id,
        content = msg.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return {
        "id": new_message.id,
        "conversation_id": new_message.conversation_id,
        "sender_id": new_message.sender_id,
        "content": new_message.content,
        "created_at": new_message.created_at
    }

@app.get("/conversations/{conversation_id}/messages")
def get_messages(
    conversation_id: int,
    skip: int = 0,
    limit: int = 20,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if not conversation:
        raise HTTPException(status_code=403, detail="Conversation not found")

    if current_user.id not in [conversation.user_one_id, conversation.user_two_id]:
        raise HTTPException(status_code=404, detail="You are not a part of this conversation")

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "content": m.content,
            "created_at": m.created_at
        }
        for m in reversed(messages)
    ]

@app.get("/users/{user_id}/status")
def get_user_status(user_id: int, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    target_user = db.query(Users).filter(Users.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    is_online = user_id in manager.active_connections

    return {
        "user_id": user_id,
        "online": is_online,
        "last_seen": target_user.last_seen if not is_online else None
    }