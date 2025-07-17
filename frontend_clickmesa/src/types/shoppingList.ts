
export interface ShoppingListItem {
    id:string;
    name: string;
    quantity: number;
    unit: string;
    purchased: boolean;
    shopping_list_id: number;

}

export interface ShoppingList {
    id: string;
    name: string;
    created_at: string;
    owner_id: number;
    items: ShoppingListItem[];  
    
}

export interface NewShoppingListItem {
    name: string;
    quantity: number;
    unit: string;
    purchased: boolean;
}