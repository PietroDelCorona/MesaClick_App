
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend_clickmesa.database import get_session
from backend_clickmesa.models import Recipe, Schedules, User
from backend_clickmesa.schemas.schedule import (
    Message,
    ScheduleCreate,
    SchedulePublic,
    ScheduleUpdate,
)

from backend_clickmesa.security import get_current_user
router = APIRouter(
    prefix="/schedules",
    tags=["schedules"]
)

Session = Annotated[AsyncSession, Depends(get_session)]


@router.get('/', response_model=list[SchedulePublic])
async def read_schedules(
    session: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 100,
):
    query = await session.scalars(
        select(Schedules)
        .options(
            selectinload(Schedules.recipe),
            selectinload(Schedules.user)
        )
        .offset(skip)
        .limit(limit)
    )

    schedules = query.all()

    return [SchedulePublic.model_validate(s, from_attributes=True) for s in schedules]


@router.get('/me', response_model=list[SchedulePublic])
async def get_my_schedules(
    session: Annotated[AsyncSession, Depends(get_session)],
    current_user: User = Depends(get_current_user),
):
    print(f"Buscando datas do usuário: {current_user.id}")
    
    result = await session.execute(
        select(Schedules)
        .where(Schedules.user_id == current_user.id)
        .options(selectinload(Schedules.recipe))  # Se quiser carregar a receita junto
    )
    
    schedules = result.scalars().all()
    return [SchedulePublic.model_validate(s, from_attributes=True) for s in schedules]

@router.get('/{schedule_id}', response_model=SchedulePublic)
async def read_schedule_by_id(
    session: Annotated[AsyncSession, Depends(get_session)],
    schedule_id: int,
):
    db_schedule = await session.scalar(
        select(Schedules)
        .where(Schedules.id == schedule_id)
    )

    if not db_schedule:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Schedule not found'
        )

    return db_schedule


@router.post('/', status_code=HTTPStatus.CREATED,
            response_model=SchedulePublic)
async def create_schedule(
    session: Annotated[AsyncSession, Depends(get_session)],
    schedule: ScheduleCreate,
):
    print(schedule)
    db_user = await session.scalar(
        select(User)
        .where(User.id == schedule.user_id)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='User not found'
        )

    db_recipe = await session.scalar(
        select(Recipe)
        .where(Recipe.id == schedule.recipe_id)
    )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    db_schedule = Schedules(
        scheduled_date=schedule.scheduled_date,
        meal_type=schedule.meal_type,
        portions=schedule.portions,
        user_id=schedule.user_id,
        recipe_id=schedule.recipe_id
    )

    session.add(db_schedule)
    await session.commit()
    await session.refresh(db_schedule)

    return db_schedule


@router.put('/{schedule_id}',
            response_model=SchedulePublic)
async def update_schedule(
    session: Annotated[AsyncSession, Depends(get_session)],
    schedule_id: int,
    schedule: ScheduleUpdate,
):

    db_schedule = await session.scalar(
        select(Schedules)
        .where(Schedules.id == schedule_id)
    )

    if not db_schedule:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Schedule not found'
        )

    if schedule.recipe_id:
        db_recipe = await session.scalar(
            select(Recipe)
            .where(Recipe.id == schedule.recipe_id)
        )

        if not db_recipe:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail='Recipe not found'
            )

    try:
        if schedule.scheduled_date:
            db_schedule.scheduled_date = schedule.scheduled_date
        if schedule.meal_type:
            db_schedule.meal_type = schedule.meal_type
        if schedule.portions:
            db_schedule.portions = schedule.portions
        if schedule.recipe_id:
            db_schedule.recipe_id = schedule.recipe_id

        await session.commit()
        await session.refresh(db_schedule)
        return db_schedule

    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Invalid data',
        )


@router.delete('/{schedule_id}',
               response_model=Message)
async def delete_schedule(
    session: Annotated[AsyncSession, Depends(get_session)],
    schedule_id: int,
):
    db_schedule = await session.scalar(
        select(Schedules)
        .where(Schedules.id == schedule_id)
    )

    if not db_schedule:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Schedule not found'
        )

    await session.delete(db_schedule)
    await session.commit()

    return {'message': 'Schedule deleted'}
