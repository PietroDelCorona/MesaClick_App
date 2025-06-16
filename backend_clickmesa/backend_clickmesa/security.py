from datetime import datetime, timedelta
from http import HTTPStatus
from zoneinfo import ZoneInfo

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import DecodeError, decode, encode
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend_clickmesa.database import get_session
from backend_clickmesa.models import User
from backend_clickmesa.settings import Settings

settings = Settings()
SECRET_KEY = settings.JWT_SECRET_KEY


pwd_context = PasswordHash.recommended()


def create_access_token(data: dict) -> str:
    """Create a JWT access token with expiration."""
    to_encode = data.copy()
    expire = datetime.now(tz=ZoneInfo("UTC")) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES
    )
    to_encode.update({"exp": expire})
    encoded_jwt = encode(
        to_encode, SECRET_KEY, algorithm=settings.ALGORITHM
        )
    return encoded_jwt


def get_password_hash(password: str) -> str:
    """Generate a password hash."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    Get the current authenticated user from JWT token.
    Args:
        session: Database session
        token: JWT token from Authorization header
    Returns:
        Authenticated user object
    Raises:
        HTTPException: If credentials are invalid
    """
    credentials_exception = HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        subject_email = payload.get("sub")

        if not subject_email:
            raise credentials_exception
    except DecodeError as exc:
        raise credentials_exception from exc

    user = session.scalar(
        select(User).where(User.email == subject_email)
    )

    if not user:
        raise credentials_exception

    return user
