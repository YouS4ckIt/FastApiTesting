from datetime import datetime
from typing import Optional, List
from pydantic import EmailStr
from sqlmodel import SQLModel
from BirbBerry.data_types.models import Category


# https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
# https://www.jetbrains.com/guide/python/tutorials/fastapi-aws-kubernetes/auth_jwt/
# class Login(SQLModel):
#     username: str
#     password: str

#
# class Token(SQLModel):
#     access_token: str
#     token_type: str


class TokenData(SQLModel):
    id: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = None


class DisplayUser(SQLModel):
    id: int
    username: str
    email: EmailStr
    permissions: Optional[List[str]]
    role: str
    created_at: datetime
    updated_at: datetime
    token: Optional[str] = None


class DisplayCategory(SQLModel):
    id: int
    name: str



class DisplayPost(SQLModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    user: DisplayUser
    category: Optional[DisplayCategory]
