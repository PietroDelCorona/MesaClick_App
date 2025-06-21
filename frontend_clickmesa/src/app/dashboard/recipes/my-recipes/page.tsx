import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import { FaBowlFood } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function Page() {
    return (
        <ProtectedPage>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="sticky top-0 z-10">
                    <InsiderHeader />
                </div>

                <div className="flex pt-4">
                    {/* Sidebar - visível apenas em desktop */}
                    <div className="hidden sm:block w-64 flex-shrink-0">
                        <Sidebar />
                    </div>

                    {/* Conteúdo Principal */}
                    <main className="flex-1 p-4 sm:ml-0 lg:ml-64">
                        <div className="max-w-7xl mx-auto">
                            {/* Título */}
                            <h1 className="text-2xl sm:text-4xl text-orange-600 text-center mt-2 mb-6">
                                Minhas Receitas
                            </h1>

                            {/* Barra de Busca */}
                            <div className="relative max-w-xl mx-auto px-4 sm:px-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Busque por nome ou ingrediente..."
                                    className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                />
                            </div>

                            {/* Grid de Receitas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4 sm:px-0">
                                {[
                                    { 
                                        icon: <FaBowlFood className="mx-auto text-4xl text-orange-500"/>, 
                                        title: "Prato X", 
                                        prep_time: "Tempo: 30 min", 
                                        description: "Descrição breve da receita e seus principais ingredientes"
                                    },
                                    { 
                                        icon: <FaBowlFood className="mx-auto text-4xl text-orange-500"/>, 
                                        title: "Prato Y", 
                                        prep_time: "Tempo: 45 min", 
                                        description: "Descrição breve da receita e seus principais ingredientes"
                                    },
                                    { 
                                        icon: <FaBowlFood className="mx-auto text-4xl text-orange-500"/>, 
                                        title: "Prato Z", 
                                        prep_time: "Tempo: 60 min", 
                                        description: "Descrição breve da receita e seus principais ingredientes"
                                    }
                                ].map((feature, index) => (
                                    <div 
                                        key={index} 
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                                    >
                                        <div className="flex flex-col items-center h-full">
                                            {feature.icon}
                                            <h3 className="font-semibold text-center mt-3 text-base md:text-lg whitespace-normal break-words">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{feature.prep_time}</p>
                                            <p className="text-sm text-gray-700 mt-2 text-center line-clamp-2">
                                                {feature.description}
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors text-sm w-full">
                                                    Ver Detalhes
                                                </button>
                                                <button className="bg-white hover:bg-gray-100 text-orange-500 border border-orange-500 px-4 py-2 rounded-md transition-colors text-sm w-full">
                                                    Adicionar à Lista
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedPage>
    );
}