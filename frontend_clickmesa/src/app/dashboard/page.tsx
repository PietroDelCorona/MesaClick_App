"use client";

import { useEffect, useState } from 'react';
import InsiderHeader from "../../components/InsiderHeader";
import Sidebar from "../../components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import useUser from "@/hooks/useUser";
import { getSchedules } from "@/services/scheduleService";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getRecipeById } from '@/services/recipeListService';

interface ScheduledMeal {
  id: number;
  title: string;
  meal_type: string;
  scheduled_date: string;
  recipe_id: number;
  recipe_title?: string;
}

export default function Page() {
  const { user } = useUser();
  const [upcomingMeals, setUpcomingMeals] = useState<ScheduledMeal[]>([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalShoppingLists, setTotalShoppingLists] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setIsLoading(true);
        const schedules = await getSchedules(token);
                
        // Filtra refeições dos próximos 7 dias
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 14);
        nextWeek.setHours(23, 59, 59, 999);
        
        const upcoming = schedules.filter(meal => {
          const mealDate = new Date(meal.scheduled_date);
          return mealDate >= today && mealDate <= nextWeek;
        });

        const mealsWithTitles = await Promise.all(
            upcoming.map(async meal => {
                try {
                    const recipe = await getRecipeById(meal.recipe_id, token);
                    return {
                        ...meal,
                        recipe_title: recipe.title
                    };
                } catch (error) {
                    console.error(`Erro ao buscar receita ${meal.recipe_id}:`, error);
                    return {
                        ...meal,
                        recipe_title: "Receita não encontrada"
                    };
                }
            })
        );

        setUpcomingMeals(mealsWithTitles);
        setTotalRecipes(12); // Substitua por chamada real à API
        setTotalShoppingLists(2); // Substitua por chamada real à API
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatMealTime = (dateString: string) => {
    try {
        // Garante que a data está no formato ISO (adiciona 'Z' se não tiver timezone)
        const isoDate = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
        const date = parseISO(isoDate);
        
        return format(date, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR });
    } catch (error) {
        console.error("Erro ao formatar data:", dateString, error);
        return "Data inválida";
    }
  };

  const getMealTypeName = (type: string) => {
    const types: Record<string, string> = {
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche"
    };
    return types[type] || type;
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-100">
        {/* Header fixo */}
        <div className="sticky top-0 z-10">
          <InsiderHeader />
        </div>

        {/* Corpo do Dashboard */}
        <div className="flex pt-4">
          {/* Sidebar */}
          <div className="hidden sm:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Conteúdo principal */}
          <main className="flex-1 p-6">
            {/* Boas-vindas e Resumo */}
            <section>
              <h1 className="text-2xl text-orange-500 font-bold mb-2">
                Bem-vindo, {user?.username || 'Usuário'}!
              </h1>
              <p className="text-black-600 mb-4">Veja o que você tem hoje:</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-orange-500">Minhas Receitas</h2>
                  <p className="text-gray-700 text-3xl mt-2">
                    {isLoading ? '...' : totalRecipes}
                  </p>
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-orange-500">Próximas Refeições</h2>
                  <p className="text-gray-700 text-3xl mt-2">
                    {isLoading ? '...' : upcomingMeals.length}
                  </p>
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-orange-500">Listas de Compras</h2>
                  <p className="text-gray-700 text-3xl mt-2">
                    {isLoading ? '...' : totalShoppingLists}
                  </p>
                </div>
              </div>
            </section>

            {/* Agenda do dia */}
            <section className="mt-10">
              <h2 className="text-xl font-bold mb-4">Próximas Refeições</h2>
              
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p>Carregando refeições...</p>
                </div>
              ) : upcomingMeals.length > 0 ? (
                <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-md">
                  {upcomingMeals.map(meal => (
                    <li key={meal.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium block">
                            {meal.recipe_title || `Refeição #${meal.id}`}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatMealTime(meal.scheduled_date)}
                          </span>
                        </div>
                        <button className="text-orange-500 hover:text-orange-700">
                          Ver detalhes
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p>Nenhuma refeição agendada para os próximos dias</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}