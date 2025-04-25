
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Meu App</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}