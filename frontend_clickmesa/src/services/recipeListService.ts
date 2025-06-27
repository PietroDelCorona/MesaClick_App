
export async function getRecipeById(id: number, token: string) {
  const res = await fetch(`http://localhost:8000/recipes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar receita");
  }

  return res.json();
}