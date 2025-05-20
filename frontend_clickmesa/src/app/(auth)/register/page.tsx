import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/OutsiderHeader";
import Footer from "@/app/components/OutsiderFooter";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-grow">
                <div className="container mx-auto py-12 px-4">
                    <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 items-center">
                        
                        <div className="w-full lg:w-1/2">
                            <h1 className="text-3xl text-orange-600 mb-8">Crie sua Conta</h1>
                            
                            <form className="space-y-6 bg-white p-8 rounded-xl shadow-md">
                                
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-orange-600 mb-1">
                                        Nome de usuário:
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="w-full border border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>

                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-orange-600 mb-1">
                                        Email:
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full border border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>

                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-orange-600 mb-1">
                                            Senha:
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full border border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-orange-600 mb-1">
                                            Confirmar Senha:
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="w-full border border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        />
                                    </div>
                                </div>

                                
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="agreed-terms"
                                            name="agreed-terms"
                                            type="checkbox"
                                            required
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="agreed-terms" className="font-medium text-gray-700">
                                            Eu concordo com os <Link href="/terms" className="text-orange-500 hover:text-orange-400">Termos de Uso</Link> e <Link href="/privacy" className="text-orange-500 hover:text-orange-400">Política de Privacidade</Link>
                                        </label>
                                    </div>
                                </div>

                                
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        Cadastrar
                                    </button>
                                </div>

                                
                                <div className="text-sm text-center text-gray-600">
                                    Já tem uma conta? <Link href="/login" className="font-medium text-orange-500 hover:text-orange-400">Faça login</Link>
                                </div>
                            </form>
                        </div>

                        
                        <div className="w-full lg:w-[55%] mt-8 lg:mt-0">
                            <div className="relative aspect-square lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
                                <Image
                                src="/images/smartphone_shopping_cart.avif"
                                alt="Fazendo compras no mercado com celular"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}