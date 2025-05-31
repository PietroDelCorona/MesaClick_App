import Image from "next/image";
import Header from "@/components/OutsiderHeader";
import Footer from "@/components/OutsiderFooter";

export default function AboutPage(){
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow">
                <section className="container mx-auto py-12 px-4">

                    <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
                        <div className="md:w-1/2 space-y-8"> 
                            <h1 className="text-3xl font-bold text-center">Sobre nós</h1>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-center">Missão</h3>
                                    <p className="text-gray-600 text-lg text-center">
                                        Facilitar o planejamento alimentar inteligente, ajudando pessoas a reduzir desperdícios e fazer compras mais conscientes,
                                        conectando pequenos mercados locais a quem precisa.
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-center">Visão</h3>
                                    <p className="text-gray-600 text-lg text-center">
                                        Ser o app preferido de famílias e profissionais do setor da gastronomia 
                                        que buscam praticidade com impacto relevante do seu cotidiano.
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-center">Valores</h3>
                                    <p className="text-gray-600 text-lg text-center">
                                        Assumimos o compromisso com o meio ambiente, promovendo práticas sustentáveis, reduzindo impactos
                                        e valorizando iniciativas que protejam os recursos naturais para as futuras gerações.
                                    </p> 
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col gap-6 items-center">
                            <div className="relative w-full aspect-square md:aspect-video -mx-4 md:mx-0">
                                <Image 
                                    src="/images/about_us.png" 
                                    alt="Equipe Click Mesa ou app em ação"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover md:object-contain rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}