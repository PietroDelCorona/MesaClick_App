
export interface ScheduleCreate {
    schedule_date: string;
    recipe_id: number;
    user_id: number;
}

export interface SchedulePublic {
    id: number;
    schedule_date: string;
    meal_type: string;
    portions: number;
    user_id: number;
    recipe_title?: string;
}