
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager


from backend_clickmesa.database import get_session_ctx
from backend_clickmesa.routes import (
    auth,
    recipes,
    schedules,
    shopping_lists,
    supermarkets,
    users,
)
from backend_clickmesa.seeds.recipes import seed_recipes
from backend_clickmesa.models import User

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código de inicialização (startup)
    async with get_session_ctx() as session:
        # 1. Cria usuário inicial se não existir
        if not await session.get(User, 1):
            session.add(User(
                id=1,
                email="user@exemple.com",
                # Adicione outros campos obrigatórios do seu modelo User
                hashed_password="testexemple",
            ))
            await session.commit()
        
        # 2. Popula receitas
        await seed_recipes(session)
    
    yield  # A aplicação roda aqui  


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://mesa-click-app.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(users.router)
app.include_router(recipes.router)
app.include_router(shopping_lists.router)
app.include_router(supermarkets.router)
app.include_router(schedules.router)
app.include_router(auth.router)


@app.get('/')
def hello_world():
    return {'message': 'Hello to Click Mesa App API.'}

