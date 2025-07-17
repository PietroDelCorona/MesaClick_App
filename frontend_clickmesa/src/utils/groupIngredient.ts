
import { ShoppingListItem } from "@/types/shoppingList";


export function groupIngredients(items: ShoppingListItem[]): ShoppingListItem[] {
    const groupedMap = new Map<string, ShoppingListItem>();

    for (const item of items) {
        const key = `${item.name.toLowerCase()}|${item.unit.toLowerCase()}`;

        if (groupedMap.has(key)) {
            const existing = groupedMap.get(key)!;
            existing.quantity += item.quantity;
        } else {
            // id e purchased não são tão relevantes no agrupamento, vamos padronizar
            groupedMap.set(key, {...item, id: "", purchased: false});
        }
    }

    const groupedItems = Array.from(groupedMap.values());

    // Agora convertemos para kg ou L quando necessário
    for (const item of groupedItems) {
        if (item.unit.toLowerCase() === "g" && item.quantity >= 1000) {
            item.unit = "kg";
            item.quantity = parseFloat((item.quantity / 1000).toFixed(2));
        } else if (item.unit.toLowerCase() === "ml" && item.quantity >= 1000) {
            item.unit = "L";
            item.quantity = parseFloat((item.quantity / 1000).toFixed(2));
        }
    }

    return groupedItems;
}