
import { useState } from "react";

interface Ingredient {
  id: number;
  value: string;
}

interface RecipeFormData {
  name: string;
  category: string;
  portions: number | string;
  description: string;
  prepTime: number | string;
}

export const useRecipeForm = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, value: "" }]);
  const [formData, setFormData] = useState<RecipeFormData>({
    name: "",
    category: "",
    portions: "",
    description: "",
    prepTime: ""
  });

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), value: "" }]);
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const handleIngredientChange = (id: number, value: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, value } : ing
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const processedValue = (name === "portions" || name === "prepTime") 
      ? value === "" ? "" : Number(value)
      : value;

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipeData = {
      ...formData,
      ingredients: ingredients.map(ing => ing.value)
    };
    console.log("Dados da receita:", recipeData);
    // Aqui você faria a submissão para sua API
  };

  return {
    ingredients,
    formData,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    handleChange,
    handleSubmit
  };
};