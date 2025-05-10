
from fastapi import FastAPI


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


@app.get('/')
def hello_world():
    return {'message': 'Hello to Click Mesa App API.'}























