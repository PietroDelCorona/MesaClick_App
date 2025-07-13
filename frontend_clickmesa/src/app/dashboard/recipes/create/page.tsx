"use client";

import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import { FaPlus, FaTrash, FaClock, FaUtensils, FaListUl } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";
import { useRecipeForm } from "@/hooks/useRecipeForm";


export default function Page() {
  const {
    formData,
    ingredients,
    steps,
    addIngredient,
    removeIngredient,
    handleChange,
    handleIngredientChange,
    addStep,
    setSteps,
    handleStepChange,
    handleSubmit
  } = useRecipeForm();


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
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Ex: Bolo de Chocolate"
                    />
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
                      placeholder="Descreva a receita..."
                    ></textarea>
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
                      <option value="main">Prato Principal</option>
                      <option value="dessert">Sobremesa</option>
                      <option value="side">Acompanhamento</option>
                      <option value="snack">Lanche</option>
                      <option value="drink">Bebida</option>
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
                        name="servings"
                        value={formData.servings}
                        onChange={handleChange}
                        onFocus={(e) => e.target.select()}
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Ex: 4"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <FaClock /> Tempo de Preparo (min) *
                      </label>
                      <input
                        type="number"
                        name="prep_time_minutes"
                        value={formData.prep_time_minutes}
                        onChange={handleChange}
                        onFocus={(e) => e.target.select()}
                        required
                        min="1"
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Ex: 30"
                      />
                    </div>
                  </div>

                  {/* Tempo de Cozimento (opcional) */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Tempo de Cozimento (min)
                    </label>
                    <input
                      type="number"
                      name="cook_time_minutes"
                      value={formData.cook_time_minutes}
                      onChange={handleChange}
                      onFocus={(e) => e.target.select()}
                      min="0"
                      className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Ex: 30"
                    />
                  </div>

                  {/* Ingredientes */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaListUl /> Ingredientes *
                    </label>
                    <div className="space-y-3">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2">
                          <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            placeholder="Nome do ingrediente"
                            className="col-span-6 px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                          <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            onFocus={(e) => e.target.select()}
                            placeholder="Qtd"
                            className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                            min="0"
                            step="0.1"
                          />
                          <input
                            type="text"
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            placeholder="Unidade"
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          {ingredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIngredient(index)}
                              className="col-span-1 p-2 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addIngredient}
                        className="mt-2 flex items-center gap-2 text-orange-500 hover:text-orange-700 cursor-pointer"
                      >
                        <FaPlus /> Adicionar ingrediente
                      </button>
                    </div>
                  </div>

                  {/* Modo de Preparo */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Modo de Preparo *
                    </label>
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="font-medium mt-2">{step.step_number}.</span>
                          <textarea
                            value={step.instruction}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            rows={2}
                            required
                          />
                          {steps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSteps = steps.filter((_, i) => i !==index);
                                setSteps(newSteps.map((step, i) => ({ ...step, step_number: i + 1 })));
                              }}
                              className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addStep}
                        className="mt-2 flex items-center gap-2 text-orange-500 hover:text-orange-700 cursor-pointer"
                      >
                        <FaPlus /> Adicionar passo
                      </button>
                    </div>
                  </div>

                  {/* Botão de Submissão */}
                  <div className="pt-4">
                    <button
                      type="submit"

                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaPlus /> Criar Receita
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}