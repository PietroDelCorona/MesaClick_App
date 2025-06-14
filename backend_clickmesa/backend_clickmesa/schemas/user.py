

from pydantic import BaseModel, EmailStr, Field


class Message(BaseModel):
    message: str


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserPublic(UserBase):
    id: int
    class Config:
        from_attributes = True


class UserList(BaseModel):
    users: list[UserPublic]
