
"use client";

import toast from 'react-hot-toast';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { FaCheck, FaTrash } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import ProtectedPage from '@/components/ProtectedPage';
import { getShoppingListById, updateShoppingListWithItems } from '@/services/shoppingListService';
import { ShoppingList } from '@/types/shoppingList';

export default function UpdateShoppingListPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token") || "";
      setToken(t);
    }
  }, []);

  useEffect(() => {
    async function fetchList() {
      if (!id || !token) return;
      try {
        const data = await getShoppingListById(token, id);
        setList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [id, token]);

  const togglePurchased = (index: number) => {
    if (!list) return;
    const newItems = list.items.map((item, i) => 
        i === index ? { ...item, purchased: !item.purchased } : item
    );
    setList({ ...list, items: newItems});
  };    

  const handleUpdateShoppingList = async () => {
    try {
      if (!list) return;
      console.log("Payload enviado para o update:", list.items);        
      await updateShoppingListWithItems(token, id, list.items);
      console.log("Atualizando lista:", {
        items: list.items
      });
      console.log("Lista atualizada com sucesso!");
      toast.success(`"${list.name}" atualizada com sucesso!`);
      router.push(`/dashboard/shopping-list/${id}`);
    } catch (err) {
      if (!list) return;
      console.error(err);
      toast.error(`Não foi possível atualizar "${list.name}"`);
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
                    <Link href={`/dashboard/shopping-list/${id}`}>
                      <button className="flex items-center text-orange-500 mb-4 cursor-pointer">
                        <IoMdArrowRoundBack className="mr-1" />
                        Voltar
                      </button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Editar Lista
                    </h1>
                  </div>
                  <button
                    onClick={handleUpdateShoppingList}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                  >
                    <FaCheck /> Atualizar Lista
                  </button>
                </div>
              </div>

              {loading && <p className="mt-6">Carregando...</p>}
              {!loading && !list && <p className="mt-6 text-red-500">Lista não encontrada.</p>}

              {/* Lista */}
              {!loading && list && (
                <div className="divide-y divide-gray-200">
                  {list.items.map((item, idx) => (
                    <div key={idx} className="p-6 flex justify-between items-center">
                      <span className={`text-lg ${item.purchased ? "line-through text-gray-400" : "text-orange-600"}`}>
                        {item.name} - {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => togglePurchased(idx)}
                        className={`px-3 py-1 rounded-lg text-sm cursor-pointer ${
                          item.purchased ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                      >
                        {item.purchased ? "Desmarcar" : "Marcar comprado"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Resumo */}
              {!loading && list && (
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Total de itens: {list.items.length}</h3>
                    <p className="text-sm text-gray-500">
                      {list.items.filter(i => i.purchased).length} marcados como comprados
                    </p>
                  </div>
                  <button
                    onClick={() => setList({ ...list, items: [] })}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                  >
                    <FaTrash /> Limpar Lista
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
