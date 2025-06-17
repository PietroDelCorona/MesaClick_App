
from datetime import datetime, timezone
from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import HttpUrl
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend_clickmesa.database import get_session
from backend_clickmesa.models import Recipe
from backend_clickmesa.schemas.recipes import (
    RecipeCard,
    RecipeCreate,
    RecipeIngredient,
    RecipePublic,
    RecipeStep,
    RecipeUpdate,
)

router = APIRouter(
    prefix="/recipes",
    tags=["recipes"]
)

Session = Annotated[AsyncSession, Depends(get_session)]


@router.get('/', response_model=List[RecipeCard])
async def read_recipes(
    session: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 100,
):

    recipes = await session.scalars(select(Recipe)
                .offset(skip)
                .limit(limit)).all()
    return recipes


@router.get('/{recipe_id}', response_model=RecipePublic)
async def read_recipe(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe_id: int,
):
    db_recipe = await session.scalar(
                            select(Recipe)
                            .where(Recipe.id == recipe_id)
                        )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    return db_recipe


@router.post(
    '/',
    status_code=HTTPStatus.CREATED,
    response_model=RecipePublic
)
async def create_recipe(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe: RecipeCreate,
):
    db_recipe = Recipe(**recipe.model_dump())
    session.add(db_recipe)
    await session.commit()
    await session.refresh(db_recipe)

    return db_recipe


@router.put('/{recipe_id}', response_model=RecipePublic)
async def update_recipe(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe_id: int,
    recipe: RecipeUpdate,
):
    db_recipe = await session.scalar(select(Recipe)
                                    .where(Recipe.id == recipe_id)
                                )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    try:
        update_data = recipe.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_recipe, field, value)

        db_recipe.updated_at = datetime.now(timezone.utc)
        await session.commit()
        await session.refresh(db_recipe)
        return db_recipe

    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Database integrity error'
        )


@router.delete('/{recipe_id}', status_code=HTTPStatus.OK)
async def delete_recipe(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe_id: int,
):
    db_recipe = await session.scalar(select(Recipe)
                                    .where(Recipe.id == recipe_id)
                                )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    await session.delete(db_recipe)
    await session.commit()

    return {'message': 'Recipe deleted'}


@router.post(
    '/{recipe_id}/ingredients',
    status_code=HTTPStatus.CREATED,
    response_model=RecipePublic
)
async def add_recipe_ingredient(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe_id: int,
    ingredient: RecipeIngredient,
):

    db_recipe = await session.scalar(
        select(Recipe)
        .where(Recipe.id == recipe_id)
        .options(selectinload(Recipe.ingredients))
    )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    new_ingredient = RecipeIngredient(
        name=ingredient.name,
        quantity=ingredient.quantity,
        unit=ingredient.unit,
        category=ingredient.category,
        recipe_id=recipe_id
    )

    session.add(new_ingredient)
    db_recipe.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(db_recipe)

    return RecipePublic.from_orm(db_recipe)


@router.post(
    '/{recipe_id}/steps',
    status_code=HTTPStatus.CREATED,
    response_model=RecipePublic
)
async def add_recipe_steps(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe_id: int,
    step: RecipeStep,
):

    db_recipe = await session.scalar(
        select(Recipe)
        .where(Recipe.id == recipe_id)
        .options(
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps)
        )
    )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    if any(existing.step_number == step.step_number
           for existing in db_recipe.steps):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=(
                f'Step number {step.step_number} already exists in this recipe'
            )
        )

    new_step = RecipeStep(
        step_number=step.step_number,
        instruction=step.instruction,
        duration_minutes=step.duration_minutes,
        recipe_id=recipe_id
    )

    session.add(new_step)
    db_recipe.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(db_recipe)

    return RecipePublic.from_orm(db_recipe)


@router.patch(
    '/{recipe_id}/image-url',
    response_model=RecipePublic
)
async def update_recipe_image_url(
    session: Annotated[AsyncSession, Depends(get_session)],
    recipe_id: int,
    image_url: HttpUrl,
):

    db_recipe = await session.scalar(
        select(Recipe)
        .where(Recipe.id == recipe_id)
        .options(
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps)
        )
    )

    if not db_recipe:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Recipe not found'
        )

    db_recipe.image_url = str(image_url)
    db_recipe.updated_at = datetime.now(timezone.utc)

    await session.commit()
    await session.refresh(db_recipe)

    return RecipePublic.from_orm(db_recipe)
