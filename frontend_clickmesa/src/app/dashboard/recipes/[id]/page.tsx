"use client";

import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import { IoMdTimer, IoMdPerson } from "react-icons/io";
import { FaUtensils, FaShoppingBasket } from "react-icons/fa";
import { PiBowlFood } from "react-icons/pi";
import { BiSolidDrink } from "react-icons/bi";
import { LuDessert } from "react-icons/lu";
import { Recipe} from "@/types/recipe";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api";

export default function RecipePage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'drink': return <BiSolidDrink className="text-6xl text-orange-400" />;
      case 'dessert': return <LuDessert className="text-6xl text-orange-400" />;
      default: return <PiBowlFood className="text-6xl text-orange-400" />;
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await apiFetch(`http://localhost:8000/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Receita não encontrada");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <ProtectedPage>
        <div className="min-h-screen bg-gray-50">
          <InsiderHeader />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  if (error) {
    return (
      <ProtectedPage>
        <div className="min-h-screen bg-gray-50">
          <InsiderHeader />
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10">
          <InsiderHeader />
        </div>

        <div className="flex pt-4">
          <div className="hidden sm:block">
            <Sidebar />
          </div>

          <main className="flex-1 p-4 sm:ml-64">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              {/* Imagem da Receita */}
              <div className="h-64 sm:h-80 bg-orange-50 flex flex-col items-center justify-center">
                {getCategoryIcon(recipe.category || '')}
                <span className="mt-4 text-orange-600 font-medium">{recipe.title}</span>
              </div>

              <div className="p-6">
                {/* Cabeçalho */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-4">
                    {recipe.title}
                  </h1>
                  
                  {/* Metadados */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <IoMdTimer />
                      <span>Preparo: {recipe.prep_time_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoMdTimer className="text-orange-500" />
                      <span>Cozimento: {recipe.cook_time_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoMdPerson />
                      <span>Rendimento: {recipe.servings} porções</span>
                    </div>
                  </div>
                </div>

                {/* Seção de Ingredientes */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <FaShoppingBasket /> Ingredientes
                  </h2>
                  <ul className="space-y-2 pl-5">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="list-disc">
                        {ingredient.quantity} {ingredient.unit} de {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Seção de Modo de Preparo */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <FaUtensils /> Modo de Preparo
                  </h2>
                  <ol className="space-y-4 pl-5">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="list-decimal pl-2">
                        <p>{step.instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Botão de Ação */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => {addItem({
                      id: recipe.id.toString(),
                      title: recipe.title,
                      quantity: 1,
                    });
                    console.log("Adicionado ao carrinho:", recipe.title);
                    toast.success(`Receita de "${recipe.title}" adicionada ao carrinho!`);
                    router.back();
                    }} 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FaShoppingBasket /> Adicionar à Lista de Compra
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  
  );
}