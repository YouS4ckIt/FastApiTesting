from typing import List
from fastapi import Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select
from starlette.exceptions import HTTPException

from BirbBerry.data_types.schema import DisplayPost
from BirbBerry.utils.jwt import get_current_user
from BirbBerry.utils.db import get_session
from BirbBerry.data_types.models import Post, Category, User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Posts"], prefix="/api/v1/posts")


@router.get("/", response_model=List[DisplayPost])
async def display_posts(skip: int = 0, limit: int = 10,
                        db: AsyncSession = Depends(get_session),
                        current_user: User = Depends(get_session)):
    query = select(Post).options(selectinload(Post.user)).options(selectinload(Post.category)).offset(skip).limit(limit)
    result = await db.execute(query)
    posts = result.scalars().all()
    logger.info(posts)
    return posts


@router.get("/categories", response_model=List[Category])
async def display_categories(skip: int = 0, limit: int = 10,
                             db: AsyncSession = Depends(get_session),
                             current_user: User = Depends(get_current_user)):
    categories_result = await db.execute(select(Category).offset(skip).limit(limit))
    categories = categories_result.scalars().all()
    return categories


@router.post("/", response_model=Post)
async def create_new_post(post: Post,
                          db: AsyncSession = Depends(get_session),
                          current_user: User = Depends(get_current_user)):

    fetch_user_info = await db.execute(select(User).where(User.email == current_user.email))
    user = fetch_user_info.first()[0]
    if not fetch_user_info:
        raise HTTPException(status_code=400, detail="You not allowed to create post!")
    if post.category_id:
        fetch_category_info = await db.execute(select(Category).where(Category.id == post.category_id))
        if fetch_category_info:
            if fetch_category_info.scalar() is None:
                raise HTTPException(status_code=400, detail="Category not exists!")
    elif post.category_id == 0:
        raise HTTPException(status_code=400, detail="Category not exists!")
    new_post = Post(title=post.title, content=post.content, user_id=user.id, created_at=post.created_at,
                    updated_at=post.updated_at, category_id=post.category_id)
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post


@router.patch("/", response_model=Post)
async def update_post(post: Post, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    if post.id == 0 or post.id is None:
        raise HTTPException(status_code=400, detail="Post not exists!")
    fetch_user_info = await db.execute(select(User).where(User.email == current_user.email))
    user = fetch_user_info.first()[0]
    if not fetch_user_info:
        raise HTTPException(status_code=400, detail="You not allowed to update post!")

    fetch_post_info = await db.execute(select(Post).where(Post.id == post.id))
    post_in_db = None
    if fetch_post_info:
        post_in_db = fetch_post_info.scalar()
        if post_in_db is None:
            raise HTTPException(status_code=400, detail="Post doesn't exists!")
    if post.category_id:
        fetch_category_info = await db.execute(select(Category).where(Category.id == post.category_id))
        if fetch_category_info:
            if fetch_category_info.scalar() is None:
                raise HTTPException(status_code=400, detail="Category does not exists!")
    elif post.category_id == 0:
        raise HTTPException(status_code=400, detail="Category not exists!")
    if post.user_id:
        if post.user_id != user.id and user.role != 'admin':
            raise HTTPException(status_code=400, detail="You not allowed to update post for someone else!")
    elif post.user_id == 0:
        raise HTTPException(status_code=400, detail="You not allowed to update post for someone else!")
    post_in_db.title = post.title
    post_in_db.content = post.content
    db.add(post_in_db)
    await db.commit()
    await db.refresh(post_in_db)
    return post_in_db


@router.delete("/", response_model=Post)
async def delete_post(post_id: int, db: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    if post_id == 0 or post_id is None:
        raise HTTPException(status_code=400, detail="Post not exists!")
    fetch_user_info = await db.execute(select(User).where(User.email == current_user.email))
    user = fetch_user_info.first()[0]
    if not fetch_user_info:
        raise HTTPException(status_code=401, detail="You not allowed to delete post!")
    if(user.role != 'admin'):
        raise HTTPException(status_code=401, detail="You not allowed to delete post!")
    fetch_post_info = await db.execute(select(Post).where(Post.id == post_id))
    post_in_db = None
    if fetch_post_info:
        post_in_db = fetch_post_info.scalar()
        if post_in_db is None:
            raise HTTPException(status_code=400, detail="Post doesn't exists!")
    await db.delete(post_in_db)
    await db.commit()
    return post_in_db


@router.post("/categories", response_model=Category)
async def create_new_category(category: Category,
                              db: AsyncSession = Depends(get_session),
                              current_user: User = Depends(get_current_user)):
    fetch_category_info = await db.execute(select(Category).where(Category.id == category.id))
    if fetch_category_info.first():
        raise HTTPException(status_code=400, detail="Category already exists!")
    new_category = Category(name=category.name)
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    return new_category
