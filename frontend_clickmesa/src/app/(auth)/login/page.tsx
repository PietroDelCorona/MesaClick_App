"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Header from "@/components/OutsiderHeader";
import Footer from "@/components/OutsiderFooter";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginResponse {
    access_token: string;
    token_type: string;
    user_id: number;
    username: string;
    detail?: string;
}

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email:"",
        password:"",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        //const formData = new URLSearchParams();
        //formData.append("username", form.email);
        //formData.append("password", form.password);

        try {
            const response = await fetch("http://localhost:8000/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: form.email,
                    password: form.password
                }),
            });

            const data: LoginResponse = await response.json();
            console.log("Resposta completa da API:", data);

            if (response.ok) {
                if (!data.access_token || !data.user_id || !data.username) {
                    throw new Error("Dados incompletos na resposta da API");
                }

                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user_id", data.user_id.toString())
                localStorage.setItem("username", data.username);

                console.log("Dados Armazenados:", {
                    token: localStorage.getItem("token"),
                    user_id: localStorage.getItem("user"),
                    username: localStorage.getItem("username")
                });
                
                router.replace("/dashboard");
            } else {
                setError(data.detail || "Credenciais inválidas.");
            }
        } catch (err) {
            console.error("Erro no login:", err);
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50"> 
            <Header />
            
            <main className="flex-grow flex items-center justify-center pb-12"> 
                <div className="w-full">
                    <div className="text-center mb-8 mt-6"> 
                        <h2 className="text-3xl text-orange-600">Acesse sua Conta</h2> 
                    </div>

                    <div className="mx-auto max-w-md px-4"> 
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-100"> 
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-orange-600">Email:</label>
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        required
                                        value={form.email}
                                        onChange={handleChange} 
                                        className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-orange-600">Senha:</label>
                                    <input 
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        required
                                        value={form.password}
                                        onChange={handleChange} 
                                        className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm text-center">{error}</p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input 
                                            id="remember-me" 
                                            name="remember-me" 
                                            type="checkbox" 
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-orange-700">
                                            Lembrar de mim
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <Link href="/forgot-password" className="font-medium text-orange-500 hover:text-orange-400">
                                            Esqueceu sua senha?
                                        </Link>  
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                                        loading ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                >
                                    {loading ? "Entrando..." : "Entrar"}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-100"> 
                                <div className="relative flex justify-center text-sm text-gray-500 mb-6">
                                    Ou continue com
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition">
                                        <FcGoogle className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Google</span>
                                    </button>

                                    <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition">
                                        <FaGithub className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">GitHub</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 text-center text-sm text-gray-600">
                                Não tem uma conta?{" "}
                                <Link href="/register" className="font-medium text-orange-500 hover:text-orange-400">
                                    Cadastre-se
                                </Link>                            
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}