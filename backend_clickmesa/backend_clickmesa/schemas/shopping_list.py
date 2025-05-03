
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class IngredientItem(BaseModel):
    name: str
    quantity: float
    unit: str


class ShoppingListBase(BaseModel):
    name: str
    user_id: int


class ShoppingListCreate(ShoppingListBase):
    pass


class ShoppingListUpdate(BaseModel):
    name: Optional[str] = None


class ShoppingListPublic(ShoppingListBase):
    id: int
    created_at: datetime
    ingredients: List[IngredientItem]

    class Config:
        from_attributes = True


class ShoppingListList(BaseModel):
    shopping_lists: List[ShoppingListPublic]
