import { apiFetch } from "./api";

export async function getRecipeById(token: string, id: number) {
  const res = await apiFetch(`http://localhost:8000/recipes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar receita");
  }

  return res.json();
}