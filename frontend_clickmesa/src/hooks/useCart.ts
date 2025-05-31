import { create } from 'zustand';

type RecipeCartItem = {
  id: string;
  title: string;
  quantity: number;
};

type CartStore = {
  items: RecipeCartItem[];
  isCartOpen: boolean;
  totalItems: number;
  addItem: (recipe: { id: string; title: string }) => void;
  updateQuantity: (id: string, action: 'increase' | 'decrease') => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],
  isCartOpen: false,
  totalItems: 0, // Será calculado automaticamente

  // Adiciona item ao carrinho ou incrementa quantidade se já existir
  addItem: (recipe) => 
    set((state) => {
      const existingItem = state.items.find((item) => item.id === recipe.id);
      const newItems = existingItem
        ? state.items.map((item) =>
            item.id === recipe.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { ...recipe, quantity: 1 }];
      
      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
      };
    }),

  // Aumenta/diminui quantidade de um item
  updateQuantity: (id, action) => 
    set((state) => {
      const newItems = state.items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
      };
    }),

  // Remove item completamente do carrinho
  removeItem: (id) => 
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
      };
    }),

  // Esvazia o carrinho
  clearCart: () => set({ items: [], totalItems: 0 }),

  // Controle de abertura/fechamento do carrinho
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));