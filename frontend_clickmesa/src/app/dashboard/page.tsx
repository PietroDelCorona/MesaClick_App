"use client";

import InsiderHeader from "../../components/InsiderHeader";
import Sidebar from "../../components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";


export default function Page() {  

  return (
    <ProtectedPage>
        <div className="min-h-screen bg-gray-100">
        {/* Header fixo */}
        <div className="sticky top-0 z-10">
            <InsiderHeader />
        </div>

        {/* Corpo do Dashboard */}
        <div className="flex pt-4">
            {/* Sidebar */}
            <div className="hidden sm:block w-64 flex-shrink-0">
            <Sidebar />
            </div>

            {/* Conteúdo principal */}
            <main className="flex-1 p-6">
            {/* Boas-vindas e Resumo */}
            <section>
                <h1 className="text-2xl text-orange-500 font-bold mb-2">Bem-vindo de volta!</h1>
                <p className="text-black-600 mb-4">Veja o que você tem hoje:</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-orange-500">Minhas Receitas</h2>
                    <p className="text-gray-700 text-3xl mt-2">12</p> {/* futuro: dados dinâmicos */}
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-orange-500">Próximas Refeições</h2>
                    <p className="text-gray-700 text-3xl mt-2">3</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-orange-500">Listas de Compras</h2>
                    <p className="text-gray-700 text-3xl mt-2">2</p>
                </div>
                </div>
            </section>

            {/* Agenda do dia */}
            <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">Refeições agendadas</h2>
                <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-md">
                <li className="p-4">
                    <div className="flex justify-between">
                    <span className="font-medium">Almoço - Lasanha</span>
                    <span className="text-sm text-gray-500">Hoje, 12:00</span>
                    </div>
                </li>
                <li className="p-4">
                    <div className="flex justify-between">
                    <span className="font-medium">Jantar - Sopa de legumes</span>
                    <span className="text-sm text-gray-500">Hoje, 19:30</span>
                    </div>
                </li>
                </ul>
            </section>
            </main>
        </div>
        </div>
    </ProtectedPage>
  );
}
