
from http import HTTPStatus
from datetime import date
from fastapi import APIRouter, Depends, HTTPException   
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend_clickmesa.database import get_session
from backend_clickmesa.models import User, Recipe, Schedules
from backend_clickmesa.schemas.schedule import (
    ScheduleBase,
    ScheduleCreate,
    SchedulePublic,
    ScheduleUpdate,
    Message    
)

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"]
)

@router.get('/', response_model=list[SchedulePublic])
def read_schedules(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    schedules = session.scalars(
        select(Schedules)
        .offset(skip)
        .limit(limit)
    ).all()

    return schedules

@router.get('/{schedule_id}', response_model=SchedulePublic)
def read_schedule_by_id(
    schedule_id: int,
    session: Session = Depends(get_session)
):
    db_schedule = session.scalar(
        select(Schedules)
        .where(Schedules.id == schedule_id)
    )

    if not db_schedule:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Schedule not found'
        )    
    
    return db_schedule

@router.post('/', status_code=HTTPStatus.CREATED, response_model=SchedulePublic)
def create_schedule(
    schedule: ScheduleCreate,
    session: Session = Depends(get_session)
):
    db_user = session.scalar(
        select(User)
        .where(User.id == schedule.user_id)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='User not found'
        )
    
    db_recipe = session.scalar(
        select(Recipe)
        .where(Recipe.id == schedule.recipe_id)
    )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )
    
    db_schedule = Schedules(
        scheduled_date=schedule.schedule_date,
        meal_type=schedule.meal_type,
        portions=schedule.portions,
        user_id=schedule.user_id,
        recipe_id=schedule.recipe_id
    )

    session.add(db_schedule)
    session.commit()
    session.refresh(db_schedule)

    return db_schedule


@router.put('/{schedule_id}', response_model=SchedulePublic)
def update_schedule(
    schedule_id: int,
    schedule: ScheduleUpdate,
    session: Session = Depends(get_session)
):
    
    db_schedule = session.scalar(
        select(Schedules)
        .where(Schedules.id == schedule_id)
    )

    if not db_schedule:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Schedule not found'
        )
    
    if schedule.recipe_id:
        db_recipe = session.scalar(
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
        
        session.commit()
        session.refresh(db_schedule)

        return db_schedule
    except IntegrityError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Invalid data',  
        )
    

@router.delete('/{schedule_id}', response_model=Message)
def delete_schedule(
    schedule_id: int,
    session: Session = Depends(get_session)
):
    db_schedule = session.scalar(
        select(Schedules)
        .where(Schedules.id == schedule_id)
    )

    if not db_schedule:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Schedule not found'
        )
    
    session.delete(db_schedule)
    session.commit()

    return {'message': 'Schedule deleted'}