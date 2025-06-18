"use client";

import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { FaListUl, FaPlus } from "react-icons/fa";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <InsiderHeader />
      </div>

      <div className="flex pt-4">
        {/* Sidebar Desktop */}
        <div className="hidden sm:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content - Ajustado para centralização correta */}
        <main className="flex-1 p-4">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center"> {/* Container centralizador */}
            <div className="space-y-4">
                <h1 className="text-3xl text-orange-600 text-center mt-2">
                    Minhas Listas de Compras
                </h1>
            </div>
            

            {/* Grid centralizado com largura controlada */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 px-4 sm:px-0">
              {[
                { 
                  icon: <FaListUl className="mx-auto text-4xl text-orange-500"/>, 
                  title: "Lista X", 
                  description: "Item A, Item B" 
                },
                { 
                  icon: <FaListUl className="mx-auto text-4xl text-orange-500"/>, 
                  title: "Lista Y", 
                  description: "Item A, Item B" 
                },
                { 
                  icon: <FaListUl className="mx-auto text-4xl text-orange-500"/>, 
                  title: "Lista Z", 
                  description: "Item A, Item B" 
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col items-center"
                >
                  {feature.icon}
                  <h3 className="font-semibold text-center mt-4 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 text-center">
                    {feature.description}
                  </p>
                  <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors w-full">
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>

            {/* Botão Criar Nova Lista - centralizado */}
            <div className="mt-10">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2 text-base">
                <FaPlus className="text-lg" />
                <span>Criar Nova Lista</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}