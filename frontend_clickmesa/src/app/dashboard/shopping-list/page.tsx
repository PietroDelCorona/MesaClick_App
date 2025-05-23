import InsiderHeader from "@/app/components/InsiderHeader";
import Sidebar from "@/app/components/Sidebar";
import { FaListUl } from "react-icons/fa";

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
                        <h1 className="text-4xl text-orange-600 text-center mt-2">Minhas Listas de Compras</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {[
                            { icon: <FaListUl className="mx-auto text-4xl text-orange-500"/>, title: "Lista X",  description: "item A, item B"},
                            { icon: <FaListUl className="mx-auto text-4xl text-orange-500"/>, title: "Lista Y",  description: "item A, item B"},
                            { icon: <FaListUl className="mx-auto text-4xl text-orange-500"/>, title: "Lista Z",  description: "item A, item B"}
                        ].map((feature, index) => (
                            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow min-w-0">
                                <div className="flex flex-col items-center h-full">
                                    {feature.icon}
                                    <h3 className="font-semibold text-center mt-3 text-base md:text-lg whitespace-normal break-words">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-700 mt-2 text-center">{feature.description}</p>
                                    <div className="flex gap-2 mt-4 text-center">
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors text-xl">
                            Criar Nova Lista
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}