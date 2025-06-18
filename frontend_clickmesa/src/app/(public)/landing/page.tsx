import Image from 'next/image';
import Link from 'next/link';
import { FaUtensils, FaShoppingCart, FaStore } from 'react-icons/fa';
import Header from '@/components/OutsiderHeader';
import Footer from '@/components/OutsiderFooter';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="container mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
            
            <div className="md:w-1/2 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  Click Mesa
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-600">
                  Planeje suas refeições sem complicação
                </h2>
                <p className="text-gray-600 text-lg">
                  Seu assistente inteligente para planejar refeições, gerar listas de compras automáticas 
                  e encontrar os melhores mercados próximos.
                </p>
                <p className="font-semibold text-gray-700 text-lg">
                  Economize tempo, reduza desperdícios e cozinhe sem stress!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <FaUtensils className="mx-auto text-4xl text-orange-500" />, title: "Cadastre Receitas" },
                  { icon: <FaShoppingCart className="mx-auto text-4xl text-orange-500" />, title: "Lista de Compras Automática" },
                  { icon: <FaStore className="mx-auto text-4xl text-orange-500" />, title: "Mercados Próximos" }
                ].map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow min-w-0">
                    <div className="flex flex-col items-center h-full">
                      {feature.icon}
                      <h3 className="font-semibold text-center mt-3 text-base md:text-lg whitespace-normal break-words">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6 items-center">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src="/images/grocery_shopping.jpg" 
                  alt="Pessoa fazendo compras no mercado com celular"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              
              <Link href="/register" className="w-full md:w-auto">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg transition-all w-full cursor-pointer hover:scale-105">
                  Comece Agora
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}