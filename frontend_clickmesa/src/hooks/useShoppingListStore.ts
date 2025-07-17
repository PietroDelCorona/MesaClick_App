import { create } from 'zustand';

type ShoppingListIngredient = {
  name: string;
  quantity: string;
  unit: string;
  purchased: boolean;
};

type ShoppingListRecipe = {
  id: string;
  title: string;
  ingredients: ShoppingListIngredient[];
};

type ShoppingListStore = {
  shoppingList: ShoppingListRecipe[];
  togglePurchased: (recipeId: string, idx: number, purchased: boolean) => void;
  removeIngredient: (recipeId: string, idx: number) => void;
  completeList: () => void;
  clearList: () => void;
  setFromCart: (data: ShoppingListRecipe[]) => void;
};

export const useShoppingListStore = create<ShoppingListStore>((set) => ({
  shoppingList: [],

  togglePurchased: (recipeId, idx, purchased) =>
    set((state) => ({
      shoppingList: state.shoppingList.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              ingredients: recipe.ingredients.map((ing, i) =>
                i === idx ? { ...ing, purchased } : ing
              ),
            }
          : recipe
      ),
    })),

  removeIngredient: (recipeId, idx) =>
    set((state) => ({
      shoppingList: state.shoppingList.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              ingredients: recipe.ingredients.filter((_, i) => i !== idx),
            }
          : recipe
      ),
    })),

  completeList: () =>
    set((state) => ({
      shoppingList: state.shoppingList
        .map((recipe) => ({
          ...recipe,
          ingredients: recipe.ingredients.filter((ing) => !ing.purchased),
        }))
        .filter((recipe) => recipe.ingredients.length > 0),
    })),

  clearList: () => set(() => ({ shoppingList: [] })),

  setFromCart: (data) => set(() => ({ shoppingList: data })),
}));
