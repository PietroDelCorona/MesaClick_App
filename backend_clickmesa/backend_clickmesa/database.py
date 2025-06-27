from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from contextlib import asynccontextmanager

from backend_clickmesa.settings import Settings

engine = create_async_engine(Settings().DATABASE_URL)
async_session = async_sessionmaker(engine, expire_on_commit=False)

# Mantenha esse para as rotas (com Depends)
async def get_session():
    async with async_session() as session:
        yield session

# Versão otimizada para o seed/operações únicas
@asynccontextmanager
async def get_session_ctx():
    async with async_session() as session:
        async with session.begin():
            yield session