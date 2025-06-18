import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="bg-white shadow-sm h-[calc(100vh-4rem)] w-64 fixed left-0 top-16 overflow-y-auto">
            <nav className="p-4 space-y-6">
                
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard/shopping-list" className="block p-2 hover:bg-gray-100 rounded transition">
                            Listas de Compras
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/recipes/my-recipes" className="block p-2 hover:bg-gray-100 rounded transition">
                            Minhas Receitas
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/map" className="block p-2 hover:bg-gray-100 rounded transition">
                            Mercados Próximos
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/recipes/create" className="block p-2 hover:bg-gray-100 rounded transition">
                            Criar Nova Receita
                        </Link>
                    </li>
                </ul>

            </nav>
        </aside>
    );
}