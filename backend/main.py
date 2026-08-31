from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import UserCreate, UserLogin, ContactCreate, ConversationCreate, MessageCreate
from models import Users, Contact, Conversation, Message
from auth import hash_password, verify_password, create_access_token, decode_access_token
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import or_, and_


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

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
        raise HTTPException(status_code=401, detail="Conversation not found")

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

