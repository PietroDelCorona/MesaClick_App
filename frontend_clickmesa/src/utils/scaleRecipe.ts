

import { Recipe } from "@/types/recipe";

export function scaleRecipe(recipe: Recipe, multiplier: number): Recipe {
    return {
        ...recipe,
        servings: typeof recipe.servings === "number"
            ? recipe.servings * multiplier
            : recipe.servings,
        ingredients: recipe.ingredients.map( ingredient => ({
            ...ingredient,
            quantity: ingredient.quantity * multiplier
        }))
    };
}