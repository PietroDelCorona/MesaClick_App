
from http import HTTPStatus

from datetime import datetime

from fastapi import FastAPI, HTTPException

from backend_clickmesa.schemas.user import (
    Message,
    UserSchema,
    UserPublic,
    UserDB,
    UserList
)

from backend_clickmesa.schemas.shopping_list import (
    ShoppingListBase,
    ShoppingListCreate,
    ShoppingListUpdate,
    ShoppingListPublic,
    ShoppingListList,
    IngredientItem
)

app = FastAPI()

database = []

shopping_lists_db = []

@app.get('/', status_code=HTTPStatus.OK, response_model=Message)
def read_root():
    return {'message': 'Hello World!'}

@app.get('/users/', response_model=UserList)
def read_users():
    return {'users': database}

@app.get('/users/{user.id}', response_model=UserPublic)
def read_user_by_id(user_id: int, user: UserSchema):
    if user_id > len(database) or user_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )
    
    user_with_id = UserDB(**user.model_dump(), id=user_id)
    return user_with_id

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

@app.get('/shopping-lists/{list.id}', response_model=ShoppingListPublic)
def read_shopping_list(list_id: int):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )
    return shopping_lists_db[list_id - 1]

@app.post("/shopping-lists/", status_code=HTTPStatus.CREATED, response_model=ShoppingListPublic)
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

@app.post('/shopping-lists/{list_id}/ingredients', response_model=ShoppingListPublic)
def add_ingredient(list_id: int, ingredient: IngredientItem):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )
    
    shopping_lists_db[list_id - 1]['ingredients'].append(ingredient.model_dump())
    return shopping_lists_db[list_id -1]