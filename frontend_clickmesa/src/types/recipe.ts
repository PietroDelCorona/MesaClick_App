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
  image_url: string | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface Recipe extends RecipeBase {
  id: number;
  created_at: string;
  updated_at?: string;
  owner_id: number;
}