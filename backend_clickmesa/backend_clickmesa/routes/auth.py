from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend_clickmesa.database import get_session
from backend_clickmesa.models import User
from backend_clickmesa.schemas.auth import Token
from backend_clickmesa.schemas.user import UserPublic
from backend_clickmesa.security import (
    create_access_token,
    get_current_user,
    verify_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

OAuth2Form = Annotated[OAuth2PasswordRequestForm, Depends()]
Session = Annotated[AsyncSession, Depends(get_session)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/token", response_model=Token)
async def login_for_access_token(
    session: Annotated[AsyncSession, Depends(get_session)],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    user = await session.scalar(
        select(User).where(User.email == form_data.username)
    )

    if not user:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "username": user.username
    }


@router.post('/refresh_token')
async def refresh_access_token(
    user: CurrentUser
):
    new_access_token = create_access_token(data={'sub': user.email})

    return {'access_token': new_access_token, 'token_type': 'bearer'}


@router.get('/me', response_model=UserPublic)
async def get_current_user_info(
    current_user: CurrentUser
):
    return current_user
