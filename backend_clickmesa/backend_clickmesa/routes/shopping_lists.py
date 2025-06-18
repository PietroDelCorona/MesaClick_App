
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend_clickmesa.database import get_session
from backend_clickmesa.models import ShoppingList, ShoppingListItem
from backend_clickmesa.schemas.shopping_list import (
    ShoppingListCreate,
    ShoppingListItemBase,
    ShoppingListItemCreate,
    ShoppingListItemPublic,
    ShoppingListPublic,
    ShoppingListUpdate,
)

shopping_lists_db = []

router = APIRouter(
    prefix="/shopping-lists",
    tags=["shopping-lists"]
)

Session = Annotated[AsyncSession, Depends(get_session)]


@router.get('/', response_model=list[ShoppingListPublic])
async def read_shopping_lists(
    session: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 100,
):
    query = await session.scalars(
        select(ShoppingList)
        .offset(skip)
        .limit(limit)
    )

    shopping_lists = query.all()

    return shopping_lists


@router.get('/{shopping_list_id}', response_model=ShoppingListPublic)
async def read_shopping_list(
    session: Annotated[AsyncSession, Depends(get_session)],
    shopping_list_id: int,
):
    db_shopping_list = await session.scalar(
        select(ShoppingList)
        .options(joinedload(ShoppingList.items))
        .where(ShoppingList.id == shopping_list_id)
    )

    if not db_shopping_list:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Shopping list not found'
        )

    return db_shopping_list


@router.post(
    "/",
    status_code=HTTPStatus.CREATED,
    response_model=ShoppingListPublic
)
async def create_shopping_list(
    shopping_list: ShoppingListCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
):
    db_shopping_list = ShoppingList(**shopping_list.model_dump())
    session.add(db_shopping_list)
    await session.commit()
    await session.refresh(db_shopping_list)

    return db_shopping_list


@router.put("/{shopping_list_id}", response_model=ShoppingListPublic)
async def update_shopping_list(
    session: Annotated[AsyncSession, Depends(get_session)],
    shopping_list_id: int,
    shopping_list: ShoppingListUpdate,
):

    db_shopping_list = await session.scalar(
        select(ShoppingList)
        .where(ShoppingList.id == shopping_list_id)
    )

    if not db_shopping_list:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Shopping List not found'
        )

    try:
        update_list = shopping_list.model_dump(exclude_unset=True)
        for field, value in update_list.items():
            setattr(db_shopping_list, field, value)

        await session.commit()
        await session.refresh(db_shopping_list)
        return db_shopping_list

    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Database integrity error'
        )


@router.delete('/{shopping_list_id}', status_code=HTTPStatus.OK)
async def delete_shopping_list(
    session: Annotated[AsyncSession, Depends(get_session)],
    shopping_list_id: int,
):

    db_shopping_list = await session.scalar(
        select(ShoppingList)
        .where(ShoppingList.id == shopping_list_id)
    )

    if not db_shopping_list:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Shopping List not found'
        )

    await session.delete(db_shopping_list)
    await session.commit()

    return {'message': 'Shopping List deleted'}


@router.post(
    '/{shopping_list_id}/items',
    response_model=ShoppingListItemPublic,
    status_code=HTTPStatus.CREATED
)
async def add_item_to_list(
    session: Annotated[AsyncSession, Depends(get_session)],
    shopping_list_id: int,
    item: ShoppingListItemCreate,
):

    db_shopping_list = await session.scalar(
        select(ShoppingList)
        .where(ShoppingList.id == shopping_list_id)
    )

    if not db_shopping_list:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Shopping List not found'
        )

    db_item = ShoppingListItem(
        name=item.name,
        quantity=item.quantity,
        unit=item.unit,
        shopping_list_id=shopping_list_id,
        purchased=item.purchased
    )

    session.add(db_item)
    await session.commit()
    await session.refresh(db_item)

    return db_item


@router.put('/items/{item_id}', response_model=ShoppingListItemPublic)
async def update_shopping_list_item(
    session: Annotated[AsyncSession, Depends(get_session)],
    item_id: int,
    item_update: ShoppingListItemBase,
):

    db_item = await session.scalar(
        select(ShoppingListItem)
        .where(ShoppingListItem.id == item_id)
    )

    if not db_item:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Item not found'
        )

    for field, value in item_update.model_dump().items():
        setattr(db_item, field, value)

    await session.commit()
    await session.refresh(db_item)

    return db_item


@router.delete('/items/{item_id}', status_code=HTTPStatus.NO_CONTENT)
async def delete_shopping_list_item(
    session: Annotated[AsyncSession, Depends(get_session)],
    item_id: int,
):

    db_item = await session.scalar(
        select(ShoppingListItem)
        .where(ShoppingListItem.id == item_id)
    )

    if not db_item:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Item not found'
        )

    await session.delete(db_item)
    await session.commit()
