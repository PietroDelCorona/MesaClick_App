"use client";

import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import Link from "next/link";
import { FaSearch, FaShoppingCart, FaTrash } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import { useCart } from "@/hooks/useCart";

export default function Page() {
  // Usando todas as funções do Zustand
  const {
    items: cartItems,
    isCartOpen,
    totalItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
  } = useCart();

  return (
    <ProtectedPage>
      <div className="min-h-screen">
        <InsiderHeader />

        <div className="flex pt-4">
          <div className="hidden sm:block">
            <Sidebar />
          </div>

          <main className="flex-1 p-4 sm:ml-64">
            <div className="space-y-4">
              <h1 className="text-4xl text-orange-600 text-center mt-2">Receitas</h1>
            </div>

            {/* Barra de busca */}
            <div className="relative max-w-xl mx-auto mt-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Busque por nome ou ingrediente..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Lista de receitas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                {
                  id: "1",
                  icon: <FaBowlFood className="mx-auto text-4xl text-orange-500" />,
                  title: "Prato X",
                  prep_time: "Tempo de Preparo: x min",
                  description: "Descrição da Receita",
                },
                {
                  id: "2",
                  icon: <FaBowlFood className="mx-auto text-4xl text-orange-500" />,
                  title: "Prato Y",
                  prep_time: "Tempo de Preparo: x min",
                  description: "Descrição da Receita",
                },
                {
                  id: "3",
                  icon: <FaBowlFood className="mx-auto text-4xl text-orange-500" />,
                  title: "Prato Z",
                  prep_time: "Tempo de Preparo: x min",
                  description: "Descrição da Receita",
                },
              ].map((feature) => (
                <div
                  key={feature.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="flex flex-col items-center h-full">
                    {feature.icon}
                    <h3 className="font-semibold text-center mt-3 text-base md:text-lg whitespace-normal break-words">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.prep_time}</p>
                    <p className="text-sm text-gray-700 mt-2 text-center">
                      {feature.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                      <Link href="#">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                          Ver Detalhes                        
                        </button>
                      </Link>
                      <button
                        onClick={() => addItem({ id: feature.id, title: feature.title })}
                        className="bg-white hover:bg-gray-100 text-orange-500 border border-orange-500 px-4 py-2 rounded-md transition-colors text-sm"
                      >
                        Adicionar à Lista
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Botão do carrinho (flutuante) - usando openCart do Zustand */}
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 z-30"
        >
          <FaShoppingCart className="text-xl" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {/* Sidebar do carrinho - usando isCartOpen e closeCart do Zustand */}
        {isCartOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={closeCart}
            />
            <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                <h2 className="text-xl text-orange-500 font-bold">Minha Lista</h2>
                <button
                  onClick={closeCart}
                  className="text-black font-bold hover:text-orange-500"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="p-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Sua lista está vazia
                  </p>
                ) : (
                  <>
                    
                    <ul className="space-y-3">
                      {cartItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center pb-2 border-b"
                        >
                          <span className="truncate flex-1">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, "decrease")}
                              className="bg-gray-100 px-2 rounded hover:bg-gray-200"
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, "increase")}
                              className="bg-gray-100 px-2 rounded hover:bg-gray-200"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mb-4 p-2 bg-orange-50 rounded-lg">
                      <p className="font-semibold text-orange-600">
                          Total de Receitas Selecionadas: {totalItems}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3 sticky bottom-0 bg-white pt-3 border-t">
                      <button
                        onClick={clearCart}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors"
                      >
                        Limpar Lista
                      </button>
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors">
                        Criar Lista de Compra
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedPage>
  );
}