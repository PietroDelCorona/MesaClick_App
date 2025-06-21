"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function InsiderHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
    
      localStorage.removeItem('token');
      
      router.push('/');
      router.refresh();
      
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  return (
    <>
      {/* Header principal */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto flex items-center justify-between p-4">
          {/* Logo + Botão do menu (mobile) */}
          <div className="flex items-center space-x-4">
            <button
              className="sm:hidden text-gray-700"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link href="/" className="text-lg sm:text-xl font-bold text-orange-500">
              Click Mesa
            </Link>
          </div>

          {/* Links principais */}
          <div className="flex space-x-2 sm:space-x-4 items-center">
            <Link href="/dashboard" className="text-sm sm:text-base hover:text-orange-500">
              Dashboard
            </Link>
            <Link href="/dashboard/recipes" className="text-sm sm:text-base hover:text-orange-500">
              Receitas
            </Link>
            <Link href="/dashboard/agenda" className="text-sm sm:text-base hover:text-orange-500">
              Agenda
            </Link>

            {/* Botão "Sair" (desktop) */}
            <button
              onClick={handleLogout}
              className="hidden sm:block bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600"
            >
              Sair
            </button>
          </div>
        </nav>
      </header>

      {/* Sidebar (mobile) */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm z-10 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden`}
      >
        <nav className="p-4 space-y-6">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard/recipes/my-recipes"
                className="block p-2 hover:bg-gray-100 rounded transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                Minhas Receitas
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/map"
                className="block p-2 hover:bg-gray-100 rounded transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                Mercados Próximos
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/recipes/create"
                className="block p-2 hover:bg-gray-100 rounded transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                Criar Nova Receita
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/shopping-list"
                className="block p-2 hover:bg-gray-100 rounded transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                Listas
              </Link>
            </li>
            {/* Botão "Sair" (mobile) */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 hover:bg-gray-100 rounded transition"
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}