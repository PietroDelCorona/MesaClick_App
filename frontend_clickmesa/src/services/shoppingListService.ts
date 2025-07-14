
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";
import { apiFetch } from "./api";


export async function getMyShoppingLists(token: string): Promise<ShoppingList[]> {
    const response = await apiFetch("http://localhost:8000/shopping-lists/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 422) {
            return [];
        }
        throw new Error("Erro ao buscar minhas listas de compras");
    }

    const data = await response.json();
    return data;
}

export async function getShoppingListById(token: string, id:string) {
    const res = await apiFetch(`http://localhost:8000/shopping-lists/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error("Erro ao buscar lista de compra.");
    }

    return res.json();
};

export async function createShoppingListWithItems(
    token: string,
    items: ShoppingListItem[]
) {
    const response = await apiFetch("http://localhost:8000/shopping-lists/with-items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            items
        })
    });

    if (!response.ok) {
        throw new Error("Erro ao criar a lista de compras");
    }

    return await response.json();
}

export async function updateShoppingListWithItems(
    token: string,
    id: string | number,
    name: string,
    items: ShoppingListItem[]
) {
    const response = await apiFetch(`http://localhost:8000/shopping-lists/${id}/with-items`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            items
        })
    });

    if(!response.ok) {
        throw new Error ("Erro ao atualizar a lista de compras")
    }

    return await response.json();

}

export async function deleteShoppingList(token: string, id: string | number) {
    const response = await apiFetch(`http://localhost:8000/shopping-lists/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao deletar a lista de compra");
    }

    return response.json();
}