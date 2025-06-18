import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { IoMdTimer, IoMdPerson } from "react-icons/io";
import { FaUtensils, FaShoppingBasket } from "react-icons/fa";

export default function RecipePage() {
  // Dados mockados - serão substituídos pela API
  const recipeData = {
    title: "Nome da Receita",
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    imageUrl: "/placeholder-recipe.jpg", // Substituir pela imagem real
    ingredients: [
      "1 xícara de ingrediente",
      "2 colheres de ingrediente",
      "200g de ingrediente principal"
    ],
    steps: [
      "Primeiro passo do preparo",
      "Segundo passo com mais detalhes",
      "Terceiro e último passo final"
    ]
  };

  return (
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
            <div className="h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagem da Receita</span>
            </div>

            <div className="p-6">
              {/* Cabeçalho */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-4">
                  {recipeData.title}
                </h1>
                
                {/* Metadados */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <IoMdTimer />
                    <span>Preparo: {recipeData.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoMdTimer className="text-orange-500" />
                    <span>Cozimento: {recipeData.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoMdPerson />
                    <span>Rendimento: {recipeData.servings} porções</span>
                  </div>
                </div>
              </div>

              {/* Seção de Ingredientes */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  <FaShoppingBasket /> Ingredientes
                </h2>
                <ul className="space-y-2 pl-5">
                  {recipeData.ingredients.map((ingredient, index) => (
                    <li key={index} className="list-disc">
                      {ingredient}
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
                  {recipeData.steps.map((step, index) => (
                    <li key={index} className="list-decimal pl-2">
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Botão de Ação */}
              <div className="flex justify-center mt-8">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                  <FaShoppingBasket /> Adicionar à Lista de Compra
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}