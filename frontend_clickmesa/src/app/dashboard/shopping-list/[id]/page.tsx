
"use client";

import toast from "react-hot-toast";

import Link from 'next/link';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import { getShoppingListById, deleteShoppingList } from "@/services/shoppingListService";
import { groupIngredients } from "@/utils/groupIngredient";
import { IoMdArrowRoundBack } from "react-icons/io";


export default function Page() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false)  

  const handleDownloadShoppingList = () => {
    if (!list) return;

    const listContent = groupIngredients(list.items
      .filter(item => !item.purchased))
      .map(item => `${item.name} - Quantidade: ${item.quantity} ${item.unit}`)
      .join("\n");

    const blob = new Blob([listContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${list.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };

  const handleDeleteShoppingList = async () => {
    try {
      await deleteShoppingList(token, id);
      console.log("Lista deletada com sucesso!");
      router.push("/dashboard/shopping-list");
      toast.success("Lista deletada com sucesso!");
    } catch(err) {
      console.error("Erro ao deletar a lista:", err);
    }   

  };

  useEffect(() => {
    // garante que roda só no client
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token") || "";
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!token || !id) return;

      try {
        const data = await getShoppingListById(token, id);
        console.log("Lista carregada:", data);
        setList(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, token]);

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

          <div className="flex-1 lg:pl-64 p-4">
            <div>
              <Link href="/dashboard/shopping-list">
                <button className="flex items-center text-orange-500 pl-8 mb-4 cursor-pointer">
                  <IoMdArrowRoundBack className="mr-2" />
                  Voltar
                </button>
              </Link>
            </div>
            {loading && <p>Carregando...</p>}
            {!loading && !list && <p>Lista não encontrada.</p>}
            {list && (
              <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-orange-600">{list.name}</h1>
                {(() => {
                  const groupedItems = groupIngredients(list.items.filter(item => !item.purchased));
                    return groupedItems.length > 0 ? (
                      <ul className="space-y-2">
                        {groupedItems.map((item, index) => (
                          <li key={index} className="text-black-600">
                            {item.name} - {item.quantity} {item.unit}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-orange-600 font-semibold">Todos os itens foram comprados!</p>
                    );
                })()}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => router.push(`/dashboard/shopping-list/${id}/update`)}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
                  >
                    Editar Lista
                  </button>
                  <button
                    onClick={handleDownloadShoppingList}
                    className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
                  >
                    Fazer download
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
                  >
                    Deletar Lista
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal fora do fluxo de list */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirmar exclusão</h2>
            <p className="mb-6 text-gray-600">Tem certeza que deseja deletar esta lista? Essa ação não poderá ser desfeita.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteShoppingList}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedPage>
  );
}