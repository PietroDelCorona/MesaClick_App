
import { ShoppingListItem } from "@/types/shoppingList";

export function groupIngredients(items: ShoppingListItem[]): ShoppingListItem[] {
    const groupedMap = new Map<string, ShoppingListItem>();

    for (const item of items) {
        const key = `${item.name.toLowerCase()}|${item.unit.toLowerCase()}`;

        if (groupedMap.has(key)) {
            const existing = groupedMap.get(key)!;
            existing.quantity += item.quantity;
        } else {
            groupedMap.set(key, {...item, id: 0, purchased: false});
        }
    }

    return Array.from(groupedMap.values());
}