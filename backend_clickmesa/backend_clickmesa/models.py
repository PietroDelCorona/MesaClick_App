
from datetime import date, datetime, timezone
from typing import List, Optional

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, registry, relationship

table_registry = registry()


@table_registry.mapped_as_dataclass
class User:
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    password: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc), init=False)

    recipes: Mapped[List["Recipe"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    shopping_lists: Mapped[List["ShoppingList"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    scheduled_meals: Mapped[List["Schedules"]] = relationship(back_populates="user", cascade="all, delete-orphan", init=False)


@table_registry.mapped_as_dataclass
class Recipe:
    __tablename__ = 'recipes'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    prep_time_minutes: Mapped[Optional[int]] = mapped_column(nullable=True)
    cook_time_minutes: Mapped[Optional[int]] = mapped_column(nullable=True)
    servings: Mapped[Optional[int]] = mapped_column(nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc), init=False)
    updated_at: Mapped[Optional[datetime]] = mapped_column(default=datetime.now(timezone.utc), init=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship(back_populates="recipes")
    ingredients: Mapped[List["RecipeIngredient"]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    steps: Mapped[List["RecipeStep"]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    scheduled_meals: Mapped[List["Schedules"]] = relationship(back_populates="recipe", cascade="all, delete-orphan", init=False)


@table_registry.mapped_as_dataclass
class RecipeIngredient:
    __tablename__ = 'recipe_ingredients'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    name: Mapped[str] = mapped_column(String(100))
    quantity: Mapped[float]
    unit: Mapped[str] = mapped_column(String(20))
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"))

    recipe: Mapped["Recipe"] = relationship(back_populates="ingredients")


@table_registry.mapped_as_dataclass
class RecipeStep:
    __tablename__ = 'recipe_steps'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    step_number: Mapped[int]
    instruction: Mapped[str] = mapped_column(Text)
    duration_minutes: Mapped[Optional[int]] = mapped_column(nullable=True)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"))

    recipe: Mapped["Recipe"] = relationship(back_populates="steps")


@table_registry.mapped_as_dataclass
class ShoppingList:
    __tablename__ = 'shopping_lists'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc), init=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship(back_populates="shopping_lists")
    items: Mapped[List["ShoppingListItem"]] = relationship(back_populates="shopping_list", cascade="all, delete-orphan")


@table_registry.mapped_as_dataclass
class ShoppingListItem:
    __tablename__ = "shopping_list_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    name: Mapped[str] = mapped_column(String(100))
    quantity: Mapped[float]
    unit: Mapped[str] = mapped_column(String(20))
    shopping_list_id: Mapped[int] = mapped_column(ForeignKey("shopping_lists.id"))

    shopping_list: Mapped["ShoppingList"] = relationship(back_populates="items")

    purchased: Mapped[bool] = mapped_column(default=False)


@table_registry.mapped_as_dataclass
class Supermarkets:
    __tablename__ = "supermarkets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    name: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(255))
    latitude: Mapped[float]
    longitude: Mapped[float]
    opening_hours: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    external_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, unique=True)

    updated_at: Mapped[Optional[datetime]] = mapped_column(onupdate=datetime.now(timezone.utc), init=False)

    shopping_lists: Mapped[List["ShoppingList"]] = relationship(back_populates="supermarket")

    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc), init=False)


@table_registry.mapped_as_dataclass
class Schedules:
    __tablename__ = "scheduled_meals"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    scheduled_date: Mapped[date] = mapped_column(Date)
    meal_type: Mapped[str] = mapped_column(String(20))

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"))

    user: Mapped["User"] = relationship(back_populates="scheduled_meals", init=False)
    recipe: Mapped["Recipe"] = relationship(back_populates="scheduled_meals", init=False)

    portions: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, default=1)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc), init=False)
    updated_at: Mapped[Optional[datetime]] = mapped_column(default=None, onupdate=datetime.now(timezone.utc), init=False)
