
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ScheduleBase(BaseModel):
    scheduled_date: datetime
    meal_type: Optional[str] = None
    portions: Optional[int] = None
    recipe_id: int


class ScheduleCreate(ScheduleBase):
    user_id: int


class ScheduleUpdate(BaseModel):
    scheduled_date: Optional[datetime] = None
    meal_type: Optional[str] = None
    portions: Optional[int] = None
    recipe_id: Optional[int] = None


class SchedulePublic(ScheduleBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class Message(BaseModel):
    message: str
