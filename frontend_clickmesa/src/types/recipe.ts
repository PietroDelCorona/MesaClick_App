export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
}

export interface RecipeBase {
  title: string;
  description: string;
  prep_time_minutes: number | string;
  cook_time_minutes?: number | string;
  servings: number | string;
  category: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface RecipeCreate extends RecipeBase {
  // Pode adicionar campos específicos se necessário
  owner_id: number | string;
  image_url: string | null;
}

export interface Recipe extends RecipeBase {
  id: number;
  created_at: string;
  updated_at?: string;
  user_id: number;
}