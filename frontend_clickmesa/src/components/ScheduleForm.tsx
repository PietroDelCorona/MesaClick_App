
"use client";

import { useState } from "react";
import { Recipe } from "@/types/recipe";

interface ScheduleFormProps {
    selectedDate: Date;
    recipes: Recipe[];
    onSubmit: (data: {
        meal_type: string;
        portions: number;
        recipe_id: number;
    }) => Promise<void>;
}

export default function ScheduleForm( { recipes, onSubmit }: ScheduleFormProps) {
    const [form, setForm] = useState({
        meal_type: 'main dish',
        portions: 1,
        recipe_id: recipes[0]?.id || 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1">Tipo de Refeição</label>
                <select
                    value={form.meal_type}
                    onChange={(e) => setForm({...form, meal_type: e.target.value})}
                    className="w-full p-2 border rounded"
                >
                    <option value="dessert">Sobremesa</option>
                    <option value="main dish">Prato Principal</option>
                    <option value="side dish">Acompanhamento</option>
                    <option value="snack">Lanche</option>
                    <option value="drink">Bebida</option>
                </select>
            </div>

            <div>
                <label className="block mb-1">Receita</label>
                <select
                    value={form.recipe_id}
                    onChange={(e) => setForm({...form, recipe_id: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                >
                    {recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1">Porções</label>
                <input 
                    type="number"
                    min="1"
                    value={form.portions}
                    onChange={(e) => setForm({...form, portions: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            >
                Agendar Refeição
            </button>
        </form>
    );
}