
from datetime import datetime
from http import HTTPStatus
from typing import List

from fastapi import FastAPI, HTTPException


from backend_clickmesa.routes import (
    users,
    recipes,
    shopping_lists,
    supermarkets
)

app = FastAPI()
app.include_router(users.router)
app.include_router(recipes.router)
app.include_router(shopping_lists.router)
app.include_router(supermarkets.router)


























