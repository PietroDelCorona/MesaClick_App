
from datetime import date
from pydantic import BaseModel
from typing import Optional

class ScheduleBase(BaseModel):
    schedule_date: date
    meal_type: str
    portions: int = 1
    recipe_id: int

class ScheduleCreate(ScheduleBase):
    user_id: int

class ScheduleUpdate(BaseModel):
    scheduled_date: Optional[date] = None
    meal_type: Optional[str] = None
    portions: Optional[int] = None
    recipe_id: Optional[int] = None

class SchedulePublic(ScheduleBase):
    id: int
    user_id: int

    class Config:
        orm_mode=True

class Message(BaseModel):
    message: str