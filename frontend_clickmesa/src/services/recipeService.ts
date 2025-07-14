
import { Recipe } from "@/types/recipe";
import { apiFetch } from "./api";

export async function getRecipes(token: string): Promise<Recipe[]> {
    const response = await apiFetch("http://localhost:8000/recipes", {
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
  const response = await apiFetch('http://localhost:8000/recipes', {
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

export async function getMyRecipes(token: string): Promise<Recipe[]> {
  const response = await apiFetch("http://localhost:8000/recipes/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 422) {
      return [];
    }
    throw new Error("Erro ao buscar minhas receitas");
  }

  return response.json();
}

export async function getRecipeById(token: string, id: string) {
  const res = await apiFetch(`http://localhost:8000/recipes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Erro ao buscar receita");
  return res.json();
}