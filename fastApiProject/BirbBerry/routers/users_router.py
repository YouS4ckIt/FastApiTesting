from typing import List

from bcrypt import hashpw, gensalt, checkpw
from fastapi import Depends, APIRouter, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from starlette.exceptions import HTTPException

from BirbBerry.data_types.schema import DisplayUser
from BirbBerry.utils.jwt import create_access_token, get_current_user
from BirbBerry.utils.db import get_session
from BirbBerry.data_types.models import User

router = APIRouter(tags=["Users"], prefix="/api/v1/users")


@router.get("/", response_model=List[DisplayUser])
async def read_users(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_session)):
    users_result = await db.execute(select(User).offset(skip).limit(limit))
    users = users_result.scalars().all()
    print(users)
    return users


@router.get("/me")
async def users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/", response_model=DisplayUser, status_code=status.HTTP_201_CREATED)
async def new_user_registration(user: User, db: AsyncSession = Depends(get_session)):
    user_exists = await db.execute(select(User).where(User.email == user.email))
    if user_exists.first():
        raise HTTPException(status_code=400, detail="User already exists!")

    hashed_password = hashpw(user.password.encode('utf-8'), gensalt())
    new_user = User(username=user.username, email=user.email,
                    password=hashed_password.decode('utf-8'),
                    created_at=user.created_at,
                    updated_at=user.updated_at,
                    permissions=user.permissions)
    access_token = create_access_token(
        data={"id": user.id, "username": user.username, "email": user.email, "permissions": user.permissions, "role": user.role})

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    display_user = DisplayUser(id=new_user.id, username=new_user.username, email=new_user.email, token=access_token,
                               permissions=new_user.permissions, role=new_user.role, created_at=new_user.created_at,
                               updated_at=new_user.updated_at)
    return {"access_token": access_token, "token_type": "Bearer", "userData": display_user}


@router.post("/login")
async def login(request: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.email == request.username))
    user = result.first()[0]
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    # Check if the entered password matches the stored hashed password
    if not checkpw(request.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid Credentials PSW")

    access_token = create_access_token(
        data={"id": user.id, "username": user.username, "email": user.email, "permissions": user.permissions, "role": user.role})
    display_user = DisplayUser(id=user.id, username=user.username, email=user.email, token=access_token,
                               permissions=user.permissions, role=user.role, created_at=user.created_at,
                               updated_at=user.updated_at)

    return {"access_token": access_token, "token_type": "Bearer", "userData": display_user}
