
"use client"

import toast from 'react-hot-toast';

import Link from 'next/link';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { FaCheck, FaTrash } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import ShoppingListItem from "@/components/ShoppingListItem";
import ProtectedPage from '@/components/ProtectedPage';
import { useShoppingListStore } from '@/hooks/useShoppingListStore';
import { createShoppingListWithItems } from '@/services/shoppingListService';
import { useRouter } from 'next/navigation';

export default function ShoppingListPage() {
  const router = useRouter();

  const {
    shoppingList,
    togglePurchased,
    removeIngredient,
    completeList,
    clearList
  } = useShoppingListStore();

  const totalItems = shoppingList.reduce(
    (total, recipe) => total + recipe.ingredients.length, 0
  );

  const purchasedItems = shoppingList.reduce(
    (total, recipe) => total + recipe.ingredients.filter(i => i.purchased).length, 0
  );

  const handleCreateShoppingList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      // "Flatten" a lista
      const flatItems = shoppingList.flatMap(recipe =>
        recipe.ingredients.map(ingredient => ({
          name: ingredient.name,
          quantity: parseFloat(ingredient.quantity) || 0,
          unit: ingredient.unit,
          purchased: ingredient.purchased
        }))
      );

      const created = await createShoppingListWithItems(token, flatItems);
      console.log("Lista criada com sucesso:", created);
      // opcional: redirect ou feedback
      router.push("/dashboard/shopping-list");
      toast.success("Lista de compras criada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível criar a lista.");
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10">
          <InsiderHeader />
        </div>

        <div className="flex pt-4">
            <div className="hidden lg:block w-64 flex-shrink-0 fixed h-full">
                <Sidebar />
            </div>
          

          <main className="flex-1 lg:pl-64 p-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Cabeçalho */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href="/dashboard/shopping-list">
                      <button className="flex items-center text-orange-500 mb-4 cursor-pointer">
                        <IoMdArrowRoundBack className="mr-1" />
                        Voltar
                      </button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Lista Consolidada
                    </h1>
                    <p className="text-sm text-gray-500">
                      Esta lista ainda não foi salva no banco.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleCreateShoppingList}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                    >
                      <FaCheck /> Salvar no Banco
                    </button>
                    <button
                      onClick={completeList}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                    >
                      <FaCheck /> Finalizar Lista
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Receitas */}
              <div className="divide-y divide-gray-200">
                {shoppingList.map((recipe) => (
                  <div key={recipe.id} className="p-6">
                    <h2 className="text-xl font-semibold text-orange-600 mb-4">
                      {recipe.title}
                    </h2>

                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <ShoppingListItem
                          key={`${recipe.id}-${idx}`}
                          name={`${ingredient.name}`}
                          quantity={`${ingredient.quantity} ${ingredient.unit}`}
                          initialPurchased={ingredient.purchased}
                          onToggle={(purchased) => togglePurchased(recipe.id, idx, purchased)}
                          onDelete={() => removeIngredient(recipe.id, idx)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Total de itens: {totalItems}</h3>
                    <p className="text-sm text-gray-500">
                      {purchasedItems} marcados como comprados
                    </p>
                  </div>
                  <button
                    onClick={clearList}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                  >
                    <FaTrash /> Limpar Lista
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
