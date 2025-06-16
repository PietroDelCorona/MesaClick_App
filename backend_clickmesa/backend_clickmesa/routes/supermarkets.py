
import os
from datetime import datetime, timezone
from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend_clickmesa.database import get_session
from backend_clickmesa.models import Supermarkets
from backend_clickmesa.schemas.supermarkets import (
    SupermarketExternal,
    SupermarketPublic,
    SupermarketUpdate,
)

router = APIRouter(
    prefix="/supermarkets",
    tags=["supermarkets"]
)

Session = Annotated[Session, Depends(get_session)]


@router.get('/nearby', response_model=List[SupermarketExternal])
async def get_nearby_markets(
    lat: float,
    lng: float,
    radius: int = 1000,
    open_now: bool = True
):

    API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

    if not API_KEY:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail='Google Maps API key not configured'
        )

    params = {
        "location": f"{lat},{lng}",
        "radius": min(radius, 50000),
        "type": "supermarket",
        "key": API_KEY
    }

    if open_now:
        params["opennow"] = "true"

    async with AsyncClient() as client:
        try:
            response = await client.get(
                "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
                params=params
            )
            data = response.json()

            if data.get("status") != "OK":
                raise HTTPException(
                    status_code=HTTPStatus.BAD_REQUEST,
                    detail=f"Google API error: {data.get('error_message',
                                                        'Unknown error')}"
                )

            return [
                SupermarketExternal(
                    name=place["name"],
                    address=place["vicinity"],
                    latitude=place["geometry"]["location"]["lat"],
                    longitude=place["geometry"]["location"]["lng"],
                    place_id=place["place_id"],
                    rating=place.get("rating"),
                    open_now="opening_hours" in place and
                    place["opening_hours"].get("open_now", False)
                )
                for place in data.get("results", [])
            ]
        except Exception as e:
            raise HTTPException(
                status_code=HTTPStatus.BAD_GATEWAY,
                detail=f'Error accessing Google API: {str(e)}'
            )


@router.get('/favorites', response_model=List[SupermarketPublic])
def list_favorites(
    session: Annotated[Session, Depends(get_session)],
):
    favorite_supermarkets = session.scalars(select(Supermarkets)).all()

    return favorite_supermarkets


@router.get('/favorites/{supermarket_id}',
            response_model=SupermarketPublic)
def read_favorite_supermarket_by_id(
    session: Annotated[Session, Depends(get_session)],
    supermarket_id: int,
):
    db_supermarket = session.scalar(select(Supermarkets)
                    .where(Supermarkets.id == supermarket_id))

    if not db_supermarket:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Supermarket not found in favorites'
        )

    return db_supermarket


@router.post('/favorites',
            response_model=SupermarketPublic,
            status_code=HTTPStatus.CREATED)
def add_favorite(
    session: Annotated[Session, Depends(get_session)],
    supermarket: SupermarketExternal,
):

    existing = session.scalar(
        select(Supermarkets)
        .where(Supermarkets.external_id == supermarket.place_id)
    )

    if existing:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Supermarket already exists in favorites'
        )

    try:
        db_supermarket = Supermarkets(
            external_id=supermarket.external_id,
            name=supermarket.name,
            address=supermarket.address,
            latitude=supermarket.latitude,
            longitude=supermarket.longitude,
            is_active=supermarket.open_now,
            rating=supermarket.rating,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        session.add(db_supermarket)
        session.commit()
        session.refresh(db_supermarket)

        return db_supermarket
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f'Error saving supermarket: {str(e)}'
        )


@router.put('/favorites/{supermarket_id}',
            response_model=SupermarketUpdate)
def update_favorite_supermarket(
    session: Annotated[Session, Depends(get_session)],
    supermarket_id: int,
    supermarket_data: SupermarketPublic,
):

    db_supermarket = session.scalar(select(Supermarkets)
                            .where(Supermarkets.id == supermarket_id))

    if not db_supermarket:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Supermarket not found in favorites'
        )

    try:
        db_supermarket.name = supermarket_data.name
        db_supermarket.address = supermarket_data.address
        db_supermarket.is_active = supermarket_data.is_active
        db_supermarket.rating = supermarket_data.rating
        db_supermarket.updated_at = datetime.now(timezone.utc)

        session.commit()
        session.refresh(db_supermarket)

        return db_supermarket
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f'Error updating supermarket: {str(e)}'
        )


@router.delete('/favorites/{supermarket_id}',
                status_code=HTTPStatus.OK)
def delete_favorite_supermarket(
    session: Annotated[Session, Depends(get_session)],
    supermarket_id: int,
):

    db_supermarket = session.scalar(select(Supermarkets)
                    .where(Supermarkets.id == supermarket_id))

    if not db_supermarket:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Supermarket not found in favorites'
        )

    try:
        session.delete(db_supermarket)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f'Error deleting supermarket: {str(e)}'
        )
