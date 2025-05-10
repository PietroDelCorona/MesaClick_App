from http import HTTPStatus

from fastapi import APIRouter, HTTPException

from backend_clickmesa.schemas.supermarkets import (
    SupermarketList,
    SupermarketLocation,
    SupermarketPublic,
)

supermarkets_db = []

router = APIRouter(
    prefix="/supermarkets",
    tags=["supermarkets"]
)

@router.get('/supermarkets/', response_model=SupermarketList)
def list_supermarkets():
    return {"supermarkets": supermarkets_db}


@router.post(
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