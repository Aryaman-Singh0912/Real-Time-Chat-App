from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ContactCreate(BaseModel):
    contact_id: int

class ConversationCreate(BaseModel):
    other_user_id: int

class MessageCreate(BaseModel):
    conversation_id: int
    content: str

    