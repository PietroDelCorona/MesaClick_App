
export interface ShoppingListItem {
    id:number;
    name: string;
    quantity: number;
    unit: string;
    purchased: boolean;
    shopping_list_id: number;

}

export interface ShoppingList {
    id: number;
    name: string;
    created_at: string;
    owner_id: number;
    items: ShoppingListItem[];  
    
}