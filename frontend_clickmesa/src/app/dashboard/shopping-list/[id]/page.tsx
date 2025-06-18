
"use client"
import Link from 'next/link';
import { useState } from 'react';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { FaCheck, FaTrash } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import ShoppingListItem from "@/components/ShoppingListItem";

interface Ingredient {
  name: string;
  quantity: string;
  purchased: boolean;
}

interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
}

interface ListData {
  id: string;
  title: string;
  createdAt: string;
  recipes: Recipe[];
}

export default function ShoppingListPage() {
  const [listData, setListData] = useState<ListData>({
    id: "1",
    title: "Minha Lista de Compras",
    createdAt: "2023-11-20",
    recipes: [
      {
        id: "101",
        title: "Lasanha Vegetariana",
        ingredients: [
          { name: "Massa para lasanha", quantity: "500g", purchased: false },
          { name: "Queijo ricota", quantity: "250g", purchased: false },
          { name: "Molho de tomate", quantity: "1 lata", purchased: false }
        ]
      },
      {
        id: "102",
        title: "Strogonoff de Frango",
        ingredients: [
          { name: "Peito de frango", quantity: "500g", purchased: false },
          { name: "Creme de leite", quantity: "1 caixa", purchased: false },
          { name: "Champignon", quantity: "200g", purchased: false }
        ]
      }
    ]
  });

  const handleToggleItem = (recipeId: string, ingredientIndex: number, purchased: boolean) => {
    setListData(prev => ({
      ...prev,
      recipes: prev.recipes.map(recipe => {
        if (recipe.id === recipeId) {
          const updatedIngredients = [...recipe.ingredients];
          updatedIngredients[ingredientIndex] = {
            ...updatedIngredients[ingredientIndex],
            purchased
          };
          return { ...recipe, ingredients: updatedIngredients };
        }
        return recipe;
      })
    }));
  };

  const handleDeleteItem = (recipeId: string, ingredientIndex: number) => {
    setListData(prev => ({
      ...prev,
      recipes: prev.recipes.map(recipe => {
        if (recipe.id === recipeId) {
          const updatedIngredients = recipe.ingredients.filter((_, idx) => idx !== ingredientIndex);
          return { ...recipe, ingredients: updatedIngredients };
        }
        return recipe;
      })
    }));
  };

  const handleClearList = () => {
    console.log("Limpar lista clicado!")
    setListData( prev => ({
        ...prev,
        recipes: []      
    }));
  };

  const handleCompleteList = () => {
    console.log("Estado ANTES:", JSON.stringify(listData, null, 2)); // Debug
    
    const updatedRecipes = listData.recipes
        .map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients.filter(ingredient => {
            const shouldKeep = !ingredient.purchased;
            console.log(`Item ${ingredient.name} - mantido? ${shouldKeep}`); // Debug
            return shouldKeep;
        })
        }))
        .filter(recipe => recipe.ingredients.length > 0);

    console.log("Estado DEPOIS:", JSON.stringify(updatedRecipes, null, 2)); // Debug
    
    setListData(prev => ({
        ...prev,
        recipes: updatedRecipes
    }));
  };

  const totalItems = listData.recipes.reduce(
   (total, recipe) => total + recipe.ingredients.length, 0
   );

  const purchasedItems = listData.recipes.reduce(
    (total, recipe) => total + recipe.ingredients.filter(i => i.purchased).length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <InsiderHeader />
      </div>

      <div className="flex pt-4">
        <div className="hidden lg:block w-64 flex-shrink-0 fixed h-full">
          <Sidebar />
        </div>

        <main className="flex-1 lg:pl-64 p-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Cabeçalho */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <Link href="/dashboard/shopping-list">
                        <button className="flex items-center text-orange-500 mb-4 cursor-pointer">
                            <IoMdArrowRoundBack className="mr-1" />
                            Voltar
                        </button>
                    </Link>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {listData.title}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Criada em: {new Date(listData.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button 
                    onClick={handleCompleteList}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer"
                    >
                        <FaCheck /> Finalizar Lista
                </button>
              </div>
            </div>

            {/* Lista de Receitas */}
            <div className="divide-y divide-gray-200">
              {listData.recipes.map((recipe) => (
                <div key={recipe.id} className="p-6">
                  <h2 className="text-xl font-semibold text-orange-600 mb-4">
                    {recipe.title}
                  </h2>
                  
                  {/* Ingredientes */}
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <ShoppingListItem
                        key={idx}
                        name={ingredient.name}
                        quantity={ingredient.quantity}
                        initialPurchased={ingredient.purchased}
                        onToggle={(purchased) => handleToggleItem(recipe.id, idx, purchased)}
                        onDelete={() => handleDeleteItem(recipe.id, idx)}
                        />
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Total de itens: {totalItems}</h3>
                  <p className="text-sm text-gray-500">
                    {purchasedItems} marcados como comprados
                  </p>
                </div>
                <button 
                    onClick={handleClearList}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm sm:text-base cursor-pointer">
                  <FaTrash /> Limpar Lista
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}