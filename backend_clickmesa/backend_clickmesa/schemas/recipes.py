
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class RecipeIngredient(BaseModel):
    name: str
    quantity: float
    unit: str
    category: Optional[str] = None


class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    duration_minutes: Optional[int] = None


class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    servings: Optional[int] = None
    user_id: int
    image_url: Optional[HttpUrl] = None


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    servings: Optional[int] = None
    image_url: Optional[HttpUrl] = None


class RecipePublic(RecipeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    ingredients: List[RecipeIngredient]
    steps: List[RecipeStep]

    class Config:
        from_attributes = True


class RecipeList(BaseModel):
    recipes: List[RecipePublic]


class RecipeCard(BaseModel):
    id: int
    title: str
    image_url: Optional[HttpUrl] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None

    class Config:
        from_attributes = True
