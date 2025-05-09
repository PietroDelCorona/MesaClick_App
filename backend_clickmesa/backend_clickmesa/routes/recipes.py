
from datetime import datetime
from http import HTTPStatus
from typing import List

from fastapi import APIRouter, HTTPException

from pydantic import HttpUrl

from backend_clickmesa.schemas.recipes import (
    RecipeCard,
    RecipeCreate,
    RecipeIngredient,
    RecipePublic,
    RecipeStep,
    RecipeUpdate,
)

recipes_db = []

router = APIRouter(
    prefix="/recipes"
)

@router.get('/recipes/', response_model=List[RecipeCard])
def read_recipes():
    return [
        {
            "id": recipe["id"],
            "title": recipe["title"],
            "image_url": recipe.get("image_url"),
            "prep_time_minutes": recipe.get("prep_time_minutes"),
            "cook_time_minutes": recipe.get("cook_time_minutes")
        }
        for recipe in recipes_db
    ]


@router.get('/recipes/{recipe_id}', response_model=RecipePublic)
def read_recipe(recipe_id: int):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )
    return recipes_db[recipe_id - 1]


@router.post(
    '/recipes/',
    status_code=HTTPStatus.CREATED,
    response_model=RecipePublic
)
def create_recipe(recipe: RecipeCreate):
    db_recipe = {
        **recipe.model_dump(),
        "id": len(recipes_db) + 1,
        "created_at": datetime.now(),
        "updated_at": None,
        "ingredients": [],
        "steps": []
    }
    recipes_db.append(db_recipe)
    return db_recipe


@router.put('/recipes/{recipe_id}', response_model=RecipePublic)
def update_recipe(recipe_id: int, recipe: RecipeUpdate):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    update_data = recipe.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        recipes_db[recipe_id - 1][field] = value

    recipes_db[recipe_id - 1]["updated_at"] = datetime.now()

    return recipes_db[recipe_id - 1]


@router.delete('/recipes/{recipe_id}', status_code=HTTPStatus.OK)
def delete_recipe(recipe_id: int):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )
    deleted = recipes_db.pop(recipe_id - 1)
    return {"message": f"Recipe '{deleted['title']}' deleted."}


@router.post('/recipes/{recipe_id}/ingredients', response_model=RecipePublic)
def add_recipe_ingredient(recipe_id: int, ingredient: RecipeIngredient):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    recipes_db[recipe_id - 1]['ingredients'].append(ingredient.model_dump())
    return recipes_db[recipe_id - 1]


@router.post('/recipes/{recipe_id}/steps', response_model=RecipePublic)
def add_recipe_steps(recipe_id: int, step: RecipeStep):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    recipes_db[recipe_id - 1]['steps'].append(step.model_dump())
    return recipes_db[recipe_id - 1]


@router.patch('/recipes/{recipe_id}/image-url', response_model=RecipePublic)
def update_recipe_image_url(
    recipe_id: int,
    image_url: HttpUrl
):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    recipes_db[recipe_id - 1]["image_url"] = image_url
    recipes_db[recipe_id - 1]["updated_at"] = datetime.now()
    return recipes_db[recipe_id - 1]