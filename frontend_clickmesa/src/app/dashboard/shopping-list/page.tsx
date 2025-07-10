"use client";

import { useEffect, useState } from "react";
import InsiderHeader from "@/components/InsiderHeader";                                        
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import { FaListUl, FaPlus } from "react-icons/fa";
import { getMyShoppingLists } from "@/services/shoppingListService";
import { ShoppingList} from "@/types/shoppingList";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function Page() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { clearCart, closeCart } = useCart();

  // Exemplo: o token viria de algum contexto ou localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    async function fetchShoppingLists() {
      try {
        setLoading(true);
        const lists = await getMyShoppingLists(token);
        console.log("Minhas listas listas recebidas:", lists)
        setShoppingLists(lists);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar listas de compras");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchShoppingLists();
    } else {
      setLoading(false);
      setError("Usuário não autenticado");
    }
  }, [token]);

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10">
          <InsiderHeader />
        </div>

        <div className="flex pt-4">
          <div className="hidden sm:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          <main className="flex-1 p-4">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
              <div className="space-y-4">
                <h1 className="text-3xl text-orange-600 text-center mt-2">
                  Minhas Listas de Compras
                </h1>
              </div>

              {loading && (
                <p className="mt-10 text-gray-600">Carregando listas...</p>
              )}

              {!loading && error && (
                <p className="mt-10 text-red-500">{error}</p>
              )}

              {!loading && !error && shoppingLists.length === 0 && (
                <p className="mt-10 text-gray-600">Nenhuma lista encontrada.</p>
              )}

              {!loading && !error && shoppingLists.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 px-4 sm:px-0">
                  {shoppingLists.map((list) => (
                    <div
                      key={list.id}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col items-center"
                    >
                      <FaListUl className="mx-auto text-4xl text-orange-500" />
                      <h3 className="font-semibold text-center mt-4 text-lg">
                        {list.name}
                      </h3>
                      <p className="text-sm text-gray-700 mt-2 text-center">
                        {list.items.length > 0
                          ? list.items
                              .slice(0, 2)
                              .map((item) => item.name)
                              .join(", ") + (list.items.length > 2 ? "..." : "")
                          : "Nenhum item"}
                      </p>
                      <button
                      onClick={() => router.push(`/dashboard/shopping-list/${list.id}`)} 
                      className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors w-full cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <button
                  onClick={() => {
                    clearCart();
                    closeCart();
                    router.push("/dashboard/recipes")
                  }} 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2 text-base cursor-pointer">
                  <FaPlus className="text-lg" />
                  <span>Criar Nova Lista</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}