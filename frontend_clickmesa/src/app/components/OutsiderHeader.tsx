
import Link from "next/link";

export default function Header() {
    return(
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto flex items-center justify-between p-4">
                <Link href="/" className="text-2x1 font-bold text-orange-500">Click Mesa</Link>

                <div className="flex space-x-6">
                    <Link href="/">Home</Link>
                    <Link href="/about">Sobre</Link>
                    <Link href="/login">Entrar</Link>
                    <Link
                    href="/register"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                    Cadastre-se
                    </Link>
                </div>
            </nav>
        </header>
    );
}