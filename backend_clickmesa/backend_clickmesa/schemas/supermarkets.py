
from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class SupermarketBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    opening_hours: Optional[str] = None
    website: Optional[HttpUrl] = None
    phone: Optional[str] = None


class SupermarketPublic(SupermarketBase):
    id: int
    class Config:
        from_attributes = True


class SupermarketCreate(SupermarketBase):
    pass


class SupermarketList(BaseModel):
    markets: List[SupermarketPublic]


class SupermarketExternal(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    opening_hours: Optional[str] = None
    rating: Optional[float] = None
    open_now: Optional[bool] = None
    place_id: Optional[int] = None


class SupermarketUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None
    rating: Optional[float] = None
