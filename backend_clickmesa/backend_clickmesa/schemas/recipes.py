from datetime import datetime
from typing import List, Optional, Union
from pydantic import BaseModel, Field

class RecipeIngredient(BaseModel):
    name: str
    quantity: Union[float, str]  # Aceita números ou strings como "pitadas"
    unit: str
    category: Optional[str] = None

class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    

class RecipeIngredientCreate(BaseModel):
    name: str
    quantity: Union[float, str]
    unit: str
    category: Optional[str] = None

class RecipeStepCreate(BaseModel):
    step_number: int
    instruction: str
    

class RecipeBase(BaseModel):
    title: str
    description: str = Field(..., description="Descrição detalhada da receita")
    prep_time_minutes: int = Field(..., gt=0, description="Tempo de preparo em minutos")
    cook_time_minutes: int = Field(0, description="Tempo de cozimento em minutos")
    servings: int = Field(..., gt=0, description="Número de porções")
    user_id: int = Field(..., alias="owner_id")
    image_url: Optional[str] = None
    category: Optional[str] = None

class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str
    prep_time_minutes: int = Field(..., gt=0)
    cook_time_minutes: int = 0
    servings: int = Field(..., gt=0)
    category: str
    image_url: Optional[str] = None
    ingredients: List[RecipeIngredientCreate] = Field(..., min_items=1)
    steps: List[RecipeStepCreate] = Field(..., min_items=1)

    class Config:
        extra = "forbid"

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    servings: Optional[int] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class RecipePublic(BaseModel):
    id: int
    title: str
    description: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    category: Optional[str]
    image_url: Optional[str]
    ingredients: List[RecipeIngredient]
    steps: List[RecipeStep]

    class Config:
        orm_mode = True

class RecipeList(BaseModel):
    recipes: List[RecipePublic]

class RecipeCard(BaseModel):
    id: int
    title: str
    image_url: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    category: Optional[str] = None

    class Config:
        orm_mode = True

class RecipeDetail(RecipeCreate):
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]



