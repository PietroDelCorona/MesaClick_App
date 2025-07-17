
export interface ScheduleCreate {
    scheduled_date: string;
    recipe_id: number;
    user_id: number;
    meal_type:string;
    portions:number;
}

export interface SchedulePublic {
    id: number;
    scheduled_date: string;
    meal_type: string;
    portions: number;
    user_id: number;
    recipe_id: number;
    recipe_title?: string;
}

export interface ScheduledMeal {
  id: number;
  meal_type: string;
  scheduled_date: string;
  recipe_id: number;
  recipe_title?: string;
  portions: number;
}