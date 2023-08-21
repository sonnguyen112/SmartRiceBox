from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    phone_num: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    phone_num:str
    password: str
    repeat_password: str
    role: str

class UserLogin(BaseModel):
    phone_num: str
    password: str

class TokenData(BaseModel):
    id: Optional[str] = None