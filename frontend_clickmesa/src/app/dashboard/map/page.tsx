
"use client"

import dynamic from 'next/dynamic';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from '@/components/ProtectedPage';

// Carregamento dinâmico para evitar problemas de SSR
const Map = dynamic(
  () => import('@/components/Map'),
  { 
    ssr: false,
    loading: () => <p>Carregando mapa...</p>
  }
);

export default function MapPage() {
    return (
        <ProtectedPage>
            <div className="min-h-screen bg-gray-50">
                <div className="sticky top-0 z-10">
                    <InsiderHeader />
                </div>

                <div className="flex pt-4">
                    <div className="hidden sm:block w-64 flex-shrink-0">
                        <Sidebar />
                    </div>

                    <main className="flex-1 p-4">
                        <h1 className="text-2xl text-orange-600 mb-4">Mercados Próximos</h1>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <Map />
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedPage>
    );
}