
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ShoppingListItemBase(BaseModel):
    name: str
    quantity: float
    unit: str
    purchased: bool = False


class ShoppingListItemCreate(ShoppingListItemBase):
    shopping_list_id: int


class ShoppingListItemPublic(ShoppingListItemBase):
    id: int
    shopping_list_id: int

    class Config:
        from_attributes = True


class ShoppingListBase(BaseModel):
    name: str
    owner_id: int

    class Config:
        from_attributes = True


class ShoppingListCreate(ShoppingListBase):
    pass


class ShoppingListUpdate(BaseModel):
    name: Optional[str] = None


class ShoppingListPublic(ShoppingListBase):
    id: int
    created_at: datetime
    items: List[ShoppingListItemPublic]

    class Config:
        from_attributes = True


class ShoppingListList(BaseModel):
    shopping_lists: List[ShoppingListPublic]

class ShoppingListItemCreateInList(BaseModel):
    name: str
    quantity: float
    unit: str
    purchased: bool = False

class ShoppingListCreateWithItems(BaseModel):
    name: Optional[str] = None
    items: List[ShoppingListItemCreateInList]