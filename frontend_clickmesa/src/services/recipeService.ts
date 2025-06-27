
import { Recipe, RecipeCreate } from "@/types/recipe";

export async function getRecipes(token: string): Promise<Recipe[]> {
    const response = await fetch("http://localhost:8000/recipes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar receitas");
  }

  return response.json();

}

export async function createRecipe(token: string, recipeData: RecipeCreate): Promise<Recipe> {
  const response = await fetch('http://localhost:8000/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(recipeData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.detail || 'Erro ao criar receita';
    throw new Error(errorMessage);
  }

  return response.json();
}