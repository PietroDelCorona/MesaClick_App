import { ScheduleCreate, ScheduledMeal } from "@/types/schedule";
import { apiFetch } from "./api";

export async function getSchedules(token: string): Promise<ScheduledMeal[]> {
    const res = await apiFetch("http://localhost:8000/schedules", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar agendamentos");
    }

    return res.json();
    
}

export async function getMySchedules(token: string): Promise<ScheduledMeal[]> {
    const response = await apiFetch("http://localhost:8000/schedules/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 422) {
            return [];
        }
        throw new Error("Erro ao buscar meus agendamentos");

    }

    return response.json();
} 

export async function createSchedule(token: string, data: ScheduleCreate) {
    const response = await fetch("http://localhost:8000/schedules/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro detalhado:", errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData))
    }

    return response.json();
}