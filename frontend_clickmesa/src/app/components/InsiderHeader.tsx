
import Link from "next/link";

export default function InsiderHeader() {
    return(
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto flex items-center justify-between p-4">
                <Link href="/" className="text-2x1 font-bold text-orange-500">Click Mesa</Link>

                <div className="flex space-x-6">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/dashboard/shopping-list">Listas</Link>
                    <Link href="/dashboard/recipes">Receitas</Link>
                    <Link href="/dashboard/map">Mercados Próximos</Link>
                    <Link href="/" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Sair</Link>
                </div>

            </nav>
        </header>
    );
}