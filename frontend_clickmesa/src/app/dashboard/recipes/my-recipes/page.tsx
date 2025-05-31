import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { FaBowlFood } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function Page() {
    return (
        <div className="min-h-screen">
            <div className="sticky top-0 z-10">
                <InsiderHeader />
            </div>

            <div className="flex pt-4">
                <Sidebar />

                <main className="ml-64 flex-1 p-4">
                    <div className="space-y-4">
                        <h1 className="text-4xl text-orange-600 text-center mt-2">Minhas Receitas</h1>
                    </div>

                    <div  className="relative max-w-xl mx-auto mt-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch />
                        </div>
                        <input
                        type="text"
                        placeholder="Busque por nome ou ingrediente..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {[
                            { icon: <FaBowlFood className="mx-auto text-4xl text-orange-500"/>, title: "Prato X", prep_time: "Tempo de Preparo: x min", description: "Descrição da Receita"},
                            { icon: <FaBowlFood className="mx-auto text-4xl text-orange-500"/>, title: "Prato Y", prep_time: "Tempo de Preparo: x min", description: "Descrição da Receita"},
                            { icon: <FaBowlFood className="mx-auto text-4xl text-orange-500"/>, title: "Prato Z", prep_time: "Tempo de Preparo: x min", description: "Descrição da Receita"}
                        ].map((feature, index) => (
                            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow min-w-0">
                                <div className="flex flex-col items-center h-full">
                                    {feature.icon}
                                    <h3 className="font-semibold text-center mt-3 text-base md:text-lg whitespace-normal break-words">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{feature.prep_time}</p>
                                    <p className="text-sm text-gray-700 mt-2 text-center">{feature.description}</p>
                                    <div className="flex gap-2 mt-4">
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                                            Ver Detalhes
                                        </button>
                                        <button className="bg-white hover:bg-gray-100 text-orange-500 border border-orange-500 px-4 py-2 rounded-md transition-colors text-sm">
                                            Adicionar à Lista
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}