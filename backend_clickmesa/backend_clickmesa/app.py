
from fastapi import FastAPI

from backend_clickmesa.routes import (
    auth,
    recipes,
    schedules,
    shopping_lists,
    supermarkets,
    users,
)

app = FastAPI()
app.include_router(users.router)
app.include_router(recipes.router)
app.include_router(shopping_lists.router)
app.include_router(supermarkets.router)
app.include_router(schedules.router)
app.include_router(auth.router)


@app.get('/')
def hello_world():
    return {'message': 'Hello to Click Mesa App API.'}
