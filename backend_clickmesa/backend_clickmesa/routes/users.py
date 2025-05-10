
from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend_clickmesa.database import get_session
from backend_clickmesa.models import User

from backend_clickmesa.schemas.user import (
    Message,
    UserBase,
    UserCreate,
    UserPublic
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get('/', response_model=UserPublic)
def read_users(
    skip: int = 0,
    limit: int= 100,
    session: Session = Depends(get_session)
):
    
    users = session.scalars(select(User).offset(skip).limit(limit)).all()
    return {'users': users}


@router.get('/{user_id}', response_model=UserPublic)
def read_user_by_id(
    user_id: int,
    session: Session = Depends(get_session)
):
    db_user = session.scalar(select(User).where(User.id == user_id))

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='User not found'
        )
    
    return db_user


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(
    user: UserCreate,
    session: Session = Depends(get_session)
):
    db_user = session.scalar(
        select(User).where(
            (User.username == user.username) | (User.email == user.email)
        )
    )

    if db_user:
        if db_user.username == user.username:
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT,
                detail='Username already exists'
            )
        elif db_user.email == user.email:
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT,
                detail='Email already exists'
            )
    
    db_user = User(
        username=user.username, password=user.password, email=user.email
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.put('/{user_id}', response_model=UserPublic)
def update_user(
    user_id: int,
    user: UserBase,
    session: Session = Depends(get_session)
):
    db_user = session.scalar(select(User).where(User.id == user_id))
    
    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='User not found'
        )
    
    try:
        db_user.username = user.username
        db_user.password = user.password
        db_user.email = user.email
        session.commit()
        session.refresh(db_user)

        return db_user
    
    except IntegrityError:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Username or Email already exists',
        )


@router.delete('/{user_id}', response_model=Message)
def delete_user(
    user_id: int,
    session: Session = Depends(get_session)
):
    db_user = session.scalar(select(User).where(User.id == user_id))

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='User not found'
        )
    
    session.delete(db_user)
    session.commit()

    return {'message': 'User deleted'}
