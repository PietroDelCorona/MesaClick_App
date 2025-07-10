
from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy import delete, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from backend_clickmesa.database import get_session
from backend_clickmesa.models import ShoppingList, ShoppingListItem, User
from backend_clickmesa.schemas.shopping_list import (
    ShoppingListCreate,
    ShoppingListItemBase,
    ShoppingListItemCreate,
    ShoppingListItemPublic,
    ShoppingListList,
    ShoppingListPublic,
    ShoppingListUpdate,
    ShoppingListCreateWithItems,
)
from backend_clickmesa.security import get_current_user

router = APIRouter(
    prefix="/shopping-lists",
    tags=["shopping-lists"]
)

Session = Annotated[AsyncSession, Depends(get_session)]


@router.get('/', response_model=ShoppingListList)
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

@router.get('/me', response_model=List[ShoppingListPublic])
async def read_my_shopping_lists(
    session: Annotated[AsyncSession, Depends(get_session)],
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    query = await session.scalars(
        select(ShoppingList)
        .options(joinedload(ShoppingList.items))
        .where(ShoppingList.owner_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )

    shopping_lists = query.unique().all()

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
    response_model=ShoppingListPublic,
    status_code=HTTPStatus.CREATED
)
async def create_shopping_list(
    shopping_list: ShoppingListCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
    current_user: User = Depends(get_current_user),
):
    db_shopping_list = ShoppingList(
        name=shopping_list.name,
        owner_id=current_user.id
    )
    session.add(db_shopping_list)
    await session.commit()
    await session.refresh(db_shopping_list)

    return db_shopping_list

@router.post(
    "/with-items",
    response_model=ShoppingListPublic,
    status_code=HTTPStatus.CREATED
)
async def create_shopping_list_with_items(
    shopping_list_data: ShoppingListCreateWithItems,
    session: Annotated[AsyncSession, Depends(get_session)],
    current_user: User = Depends(get_current_user),
):
    # Conta quantas listas o usuário já possui para gerar o nome
    count_result = await session.execute(
        select(func.count()).select_from(ShoppingList).where(ShoppingList.owner_id == current_user.id)
    )
    count = count_result.scalar() or 0

    generated_name = f"Lista {count + 1}"

    db_shopping_list = ShoppingList(
        name=generated_name,
        owner=current_user,
        supermarket_id=None
    )
    session.add(db_shopping_list)
    await session.flush()  # garante db_shopping_list.id

    for item in shopping_list_data.items:
        db_item = ShoppingListItem(
            name=item.name,
            quantity=item.quantity,
            unit=item.unit,
            purchased=item.purchased,
            shopping_list_id=db_shopping_list.id
        )
        session.add(db_item)

    await session.commit()

    # agora recarrega com selectinload para popular items
    result = await session.execute(
        select(ShoppingList)
        .options(selectinload(ShoppingList.items))
        .where(ShoppingList.id == db_shopping_list.id)
    )
    shopping_list_with_items = result.scalar_one()

    return shopping_list_with_items


@router.put("/{shopping_list_id}/with-items",
    response_model=ShoppingListPublic,
    status_code=HTTPStatus.OK
)
async def update_shopping_list_with_items(
    shopping_list_id: int,
    shopping_list_data: ShoppingListCreateWithItems,
    session: Annotated[AsyncSession, Depends(get_session)],
    current_user: User = Depends(get_current_user),
):
    
    result = await session.execute(
        select(ShoppingList)
        .where(ShoppingList.id == shopping_list_id)
        .where(ShoppingList.owner_id == current_user.id)
    )

    db_shopping_list = result.scalar_one_or_none()

    if not db_shopping_list:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Lista de compras não encontrada'
        )
    
    db_shopping_list.name = shopping_list_data.name

    print("Payload recebido pelo PUT:", shopping_list_data.items)

    await session.execute(
        delete(ShoppingListItem)
        .where(ShoppingListItem.shopping_list_id == shopping_list_id)
    )

    for item in shopping_list_data.items:
        db_item = ShoppingListItem(
            name=item.name,
            quantity=item.quantity,
            unit=item.unit,
            purchased=item.purchased,
            shopping_list_id=shopping_list_id
        )
        session.add(db_item)
    
    await session.commit()

    result = await session.execute(
        select(ShoppingList)
        .options(selectinload(ShoppingList.items))
        .where(ShoppingList.id == shopping_list_id)
    )
    shopping_list_with_items = result.scalar_one()

    print("Lista recarregada com sucesso", [item.name for item in shopping_list_with_items.items])

    return shopping_list_with_items

    

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
