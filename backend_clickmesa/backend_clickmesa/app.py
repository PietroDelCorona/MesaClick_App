
from datetime import datetime
from http import HTTPStatus
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import HttpUrl

from backend_clickmesa.schemas.recipes import (
    RecipeCard,
    RecipeCreate,
    RecipeIngredient,
    RecipePublic,
    RecipeStep,
    RecipeUpdate,
)
from backend_clickmesa.schemas.shopping_list import (
    IngredientItem,
    ShoppingListCreate,
    ShoppingListList,
    ShoppingListPublic,
    ShoppingListUpdate,
)
from backend_clickmesa.schemas.supermarkets import (
    SupermarketList,
    SupermarketLocation,
    SupermarketPublic,
)
from backend_clickmesa.schemas.user import (
    Message,
    UserDB,
    UserList,
    UserPublic,
    UserSchema,
)

app = FastAPI()

database = []

shopping_lists_db = []

recipes_db = []

supermarkets_db = []


@app.get('/', status_code=HTTPStatus.OK, response_model=Message)
def read_root():
    return {'message': 'Hello World!'}


@app.get('/users/', response_model=UserList)
def read_users():
    return {'users': database}


@app.get('/users/{user_id}', response_model=UserPublic)
def read_user_by_id(user_id: int):
    if user_id > len(database) or user_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    return database[user_id - 1]


@app.post('/users', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(user: UserSchema):
    user_with_id = UserDB(**user.model_dump(), id=len(database) + 1)

    database.append(user_with_id)

    return user_with_id


@app.put('/users/{user.id}', response_model=UserPublic)
def update_user(user_id: int, user: UserSchema):
    if user_id > len(database) or user_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    user_with_id = UserDB(**user.model_dump(), id=user_id)
    database[user_id - 1] = user_with_id

    return user_with_id


@app.delete('/users/{user.id}', response_model=Message)
def delete_user(user_id: int):
    if user_id > len(database) or user_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    del database[user_id - 1]

    return {'message': 'User deleted'}


@app.get('/shopping-lists/', response_model=ShoppingListList)
def read_shopping_lists():
    return {'shopping_lists': shopping_lists_db}


@app.get('/shopping-lists/{list_id}', response_model=ShoppingListPublic)
def read_shopping_list(list_id: int):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )
    return shopping_lists_db[list_id - 1]


@app.post(
    "/shopping-lists/",
    status_code=HTTPStatus.CREATED,
    response_model=ShoppingListPublic
)
def create_shopping_list(shopping_list: ShoppingListCreate):
    """Cria uma nova lista de compras."""
    db_shopping_list = {
        **shopping_list.model_dump(),
        "id": len(shopping_lists_db) + 1,
        "created_at": datetime.now(),
        "ingredients": []  # Inicialmente vazia
    }
    shopping_lists_db.append(db_shopping_list)
    return db_shopping_list


@app.put("/shopping-lists/{list_id}", response_model=ShoppingListPublic)
def update_shopping_list(list_id: int, shopping_list: ShoppingListUpdate):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )

    if shopping_list.name:
        shopping_lists_db[list_id - 1]["name"] = shopping_list.name

    return shopping_lists_db[list_id - 1]


@app.delete('/shopping-lists/{list_id}', status_code=HTTPStatus.OK)
def delete_shopping_list(list_id: int):
    if list_id < 1 or list_id > len(shopping_lists_db):
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )
    deleted = shopping_lists_db.pop(list_id - 1)
    return {"message": f"List '{deleted['name']}' deleted."}


@app.post(
    '/shopping-lists/{list_id}/ingredients',
    response_model=ShoppingListPublic
)
def add_ingredient(list_id: int, ingredient: IngredientItem):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )

    shopping_lists_db[list_id - 1]
    ['ingredients'].append(ingredient.model_dump())
    return shopping_lists_db[list_id - 1]


@app.get('/recipes/', response_model=List[RecipeCard])
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


@app.get('/recipes/{recipe_id}', response_model=RecipePublic)
def read_recipe(recipe_id: int):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )
    return recipes_db[recipe_id - 1]


@app.post(
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


@app.put('/recipes/{recipe_id}', response_model=RecipePublic)
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


@app.delete('/recipes/{recipe_id}', status_code=HTTPStatus.OK)
def delete_recipe(recipe_id: int):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )
    deleted = recipes_db.pop(recipe_id - 1)
    return {"message": f"Recipe '{deleted['title']}' deleted."}


@app.post('/recipes/{recipe_id}/ingredients', response_model=RecipePublic)
def add_recipe_ingredient(recipe_id: int, ingredient: RecipeIngredient):
    if recipe_id > len(recipes_db) or recipes_db < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    recipes_db[recipe_id - 1]['ingredients'].append(ingredient.model_dump())
    return recipes_db[recipe_id - 1]


@app.post('/recipes/{recipe_id}/steps', response_model=RecipePublic)
def add_recipe_steps(recipe_id: int, step: RecipeStep):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    recipes_db[recipe_id - 1]['steps'].append(step.model_dump())
    return recipes_db[recipe_id - 1]


@app.patch('/recipes/{recipe_id}/image-url', response_model=RecipePublic)
def update_recipe_image_url(
    recipe_id: int,
    image_url: HttpUrl
):
    if recipe_id > len(recipes_db) or recipe_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Recipe not found'
        )

    recipes_db[recipe_id - 1]["image-url"] = image_url
    recipes_db[recipe_id - 1]["updated_at"] = datetime.now()
    return recipes_db[recipe_id - 1]


@app.get('/supermarkets/', response_model=SupermarketList)
def list_supermarkets():
    return {"supermarkets": supermarkets_db}


@app.post(
    '/supermarkets/',
    status_code=HTTPStatus.CREATED,
    response_model=SupermarketPublic
)
def create_supermarket(supermarket: SupermarketLocation):
    db_supermarket = {
        **supermarket.model_dump(),
        "id": len(supermarkets_db) + 1
    }

    supermarkets_db.append(db_supermarket)
    return db_supermarket
