import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Header from "@/app/components/OutsiderHeader";
import Footer from "@/app/components/OutsiderFooter";

export default function LoginPage() {
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
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-orange-600">Email:</label>
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        required 
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
                                        className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                                    />
                                </div>

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
                                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                                >
                                    Entrar
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