"use client";

import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import { FaPlus, FaTrash, FaClock, FaUtensils, FaListUl } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";
import { useRecipeForm } from "@/hooks/useRecipeForm";



export default function Page() {
  const {
    ingredients,
    formData,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    handleChange,
    handleSubmit
  } = useRecipeForm();

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
          <div className="container mx-auto py-6 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
              <h1 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
                <FaUtensils /> Criar Nova Receita
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome da Receita */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nome da Receita *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ex: Bolo de Chocolate"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Categoria *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Sobremesa">Sobremesa</option>
                    <option value="Prato Principal">Prato Principal</option>
                    <option value="Acompanhamento">Acompanhamento</option>
                    <option value="Lanche">Lanche</option>
                    <option value="Bebida">Bebida</option>
                  </select>
                </div>

                {/* Porções e Tempo de Preparo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <BiSolidDish /> Porções *
                    </label>
                    <input
                      type="number"
                      name="portions"
                      value={formData.portions}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Quantas porções rende"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaClock /> Tempo de Preparo (min) *
                    </label>
                    <input
                      type="number"
                      name="prepTime"
                      value={formData.prepTime}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Tempo em minutos"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Descrição *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Descreva a receita, modo de preparo, etc..."
                  ></textarea>
                </div>

                {/* Ingredientes */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaListUl /> Ingredientes *
                  </label>
                  <div className="space-y-3">
                    {ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ingredient.value}
                          onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Ex: 1 xícara de farinha de trigo"
                        />
                        {ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(ingredient.id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="mt-2 flex items-center gap-1 text-orange-500 hover:text-orange-700 font-medium"
                    >
                      <FaPlus /> Adicionar outro ingrediente
                    </button>
                  </div>
                </div>

                {/* Botão de Submissão */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Adicionar Receita
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}