
from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class SupermarketLocation(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    opening_hours: Optional[str] = None
    website: Optional[HttpUrl] = None
    phone: Optional[str] = None


class SupermarketPublic(SupermarketLocation):
    id: int


class SupermarketList(BaseModel):
    markets: List[SupermarketPublic]
