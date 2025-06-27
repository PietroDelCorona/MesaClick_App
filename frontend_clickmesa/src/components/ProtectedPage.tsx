"use client";

import { ReactNode } from "react";
import useAuthGuard from "@/hooks/useAuthGuard";
import Link from "next/link";

interface ProtectedPageProps {
    children: ReactNode;
}

export default function ProtectedPage({ children}: ProtectedPageProps) {
    const {isChecking, unauthorized} = useAuthGuard();

    if (isChecking) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h2 className="text-2xl font-semibold mb-2 text-orange-600">
                    Acesso Não Autorizado
                </h2>
                <p className="mb-4">Você precisa estar logado para acessar essa página.</p>
                <div className="space-x-4">
                    <Link
                    href="/login"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                    >Ir para Login
                    </Link>
                    <Link
                    href="/register"
                    className="text-orange-500 hover:underline"
                    >Criar uma conta</Link>
                </div>
            </div>
        );
    }
    
    return <>{children}</>
}