"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Click Mesa
        </Link>

        {/* Grupo do botão Entrar + hambúrguer no mobile */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link
            href="/login"
            className="text-orange-500 font-medium"
          >
            Entrar
          </Link>

          <button
            className="text-gray-500 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu para desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
          <Link href="/about" className="hover:text-orange-500">
            Sobre
          </Link>
          <Link href="/login" className="hover:text-orange-500">
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Cadastre-se
          </Link>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="block py-2 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/register"
              className="block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
