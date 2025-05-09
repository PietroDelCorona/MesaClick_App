from datetime import datetime
from http import HTTPStatus

from fastapi import APIRouter, HTTPException

from backend_clickmesa.schemas.shopping_list import (
    IngredientItem,
    ShoppingListCreate,
    ShoppingListList,
    ShoppingListPublic,
    ShoppingListUpdate,
)

shopping_lists_db = []

router = APIRouter(
    prefix="/shopping-lists"
)

@router.get('/shopping-lists/', response_model=ShoppingListList)
def read_shopping_lists():
    return {'shopping_lists': shopping_lists_db}


@router.get('/shopping-lists/{list_id}', response_model=ShoppingListPublic)
def read_shopping_list(list_id: int):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )
    return shopping_lists_db[list_id - 1]


@router.post(
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


@router.put("/shopping-lists/{list_id}", response_model=ShoppingListPublic)
def update_shopping_list(list_id: int, shopping_list: ShoppingListUpdate):
    if list_id > len(shopping_lists_db) or list_id < 1:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )

    if shopping_list.name:
        shopping_lists_db[list_id - 1]["name"] = shopping_list.name

    return shopping_lists_db[list_id - 1]


@router.delete('/shopping-lists/{list_id}', status_code=HTTPStatus.OK)
def delete_shopping_list(list_id: int):
    if list_id < 1 or list_id > len(shopping_lists_db):
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='List not found'
        )
    deleted = shopping_lists_db.pop(list_id - 1)
    return {"message": f"List '{deleted['name']}' deleted."}

@router.post(
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