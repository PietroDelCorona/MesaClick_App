"use client";

import toast from "react-hot-toast";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRecipe } from '@/services/recipeService';
import { RecipeCreate, RecipeIngredient, RecipeStep } from '@/types/recipe';
import useUser from '@/hooks/useUser'; 

export const useRecipeForm = () => {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<RecipeCreate, 'ingredients' | 'steps'>>({
    title: '',
    description: '',
    prep_time_minutes: 0,
    cook_time_minutes: 0,
    servings: 0,
    category: '',
    image_url: '' // Corrigido de null para string
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
    const newIngredients = [...ingredients];
    if (field === 'quantity') {
      newIngredients[index][field] = parseFloat(value) || 0;
    } else {
      newIngredients[index][field] = value;
    }
    setIngredients(newIngredients);
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

    const toastId = toast.loading("Criando receita...");
    
    try {
      const recipeData: RecipeCreate = {
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
        image_url: formData.image_url || undefined // ajuste opcional
      };

      await createRecipe(token, recipeData);
      toast.success("Receita criada com sucesso!", { id: toastId });
      router.push("/dashboard/recipes/my-recipes");

    } catch (error) {
      toast.error("Erro ao criar a receita", { id: toastId })
      console.error("Erro ao criar receita:", error);      
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
