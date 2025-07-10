"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRecipe } from '@/services/recipeService';
import { RecipeBase, RecipeIngredient, RecipeStep } from '@/types/recipe';
import useUser from '@/hooks/useUser'; 

export const useRecipeForm = () => {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<RecipeBase, 'ingredients' | 'steps'>>({
    title: '',
    description: '',
    prep_time_minutes: 0,
    cook_time_minutes: 0,
    servings: 0,
    category: '',
    image_url: null
  });

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([{
    name: '',
    quantity: 0,
    unit: ''
  }]);

  const [steps, setSteps] = useState<RecipeStep[]>([{
    step_number: 1,
    instruction: ''
  }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', quantity: 0, unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string) => {
    setIngredients(prev =>
      prev.map((item, i) =>
        i === index ? {
          ...item,
          [field]: field === 'quantity' ? Number(value) || 0 : value
        } : item
      )
    );
  };

  const addStep = () => {
    setSteps(prev => [...prev, {
      step_number: prev.length + 1,
      instruction: ''
    }]);
  };

  const handleStepChange = (index: number, value: string) => {
    setSteps(prev =>
      prev.map((step, i) =>
        i === index ? { ...step, instruction: value } : step
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para criar receitas");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }
    
    try {
      const recipeData: RecipeBase = {
        ...formData,
        ingredients: ingredients
          .filter(ing => ing.name.trim() !== "")
          .map(ing => ({
            name: ing.name.trim(),
            quantity: Number(ing.quantity) || 0,
            unit: ing.unit.trim() || "un"
          })),
        steps: steps
          .filter(step => step.instruction.trim() !== "")
          .map((step, i) => ({
            step_number: i + 1,
            instruction: step.instruction.trim()
          })),
        image_url: null
      };

      await createRecipe(token, recipeData);
      router.push("/dashboard/recipes/my-recipes");

    } catch (error) {
      console.error("Erro ao criar receita:", error);
      alert(error instanceof Error ? error.message : "Erro desconhecido ao criar receita.");
    }   
  };

  return {
    formData,
    ingredients,
    steps,
    addIngredient,
    removeIngredient,
    handleChange,
    handleIngredientChange,
    addStep,
    handleStepChange,
    setSteps,
    handleSubmit
  };
};