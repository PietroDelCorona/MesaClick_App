"use client"

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {format, parse, startOfWeek, getDay} from 'date-fns';
import {ptBR} from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus } from 'react-icons/fa';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from '@/components/ProtectedPage';
import { getSchedules, createSchedule } from '@/services/scheduleService';
import { getRecipes } from '@/services/recipeService';
import { Recipe } from '@/types/recipe';

// Configuração de localização
const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Tipos de eventos
interface RecipeEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  recipeId: number;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<RecipeEvent[]>([]);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'agenda'>('week');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [mealType, setMealType] = useState('lunch');
  const [portions, setPortions] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [schedules, recipes] = await Promise.all([
          getSchedules(token),
          getRecipes(token)
        ]);
        
        setRecipes(recipes);
        setEvents(schedules.map(schedule => ({
          id: schedule.id,
          title: recipes.find(r => r.id === schedule.recipe_id)?.title || "Receita Agendada",
          start: new Date(schedule.scheduled_date),
          end: new Date(schedule.scheduled_date),
          recipeId: schedule.recipe_id,
        })));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);
 
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setShowModal(true);
  };

  const handleAddRecipe = async () => {
    if (recipes.length === 0) {
      alert("Nenhuma receita disponível. Cadastre receitas primeiro.");
      return;
    }

    if (!selectedSlot || !selectedRecipeId) {
      alert("Por favor, selecione uma data e uma receita");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("user_id"));
    
    if (!token || !userId) {
      alert("Sessão inválida. Faça login novamente.");
      return;
    }

    try {
      const newSchedule = {
        scheduled_date: selectedSlot.start.toISOString().split('T')[0], 
        recipe_id: selectedRecipeId,
        user_id: userId,
        meal_type: mealType,
        portions: portions
      };

      const createdSchedule = await createSchedule(token, newSchedule);

      setEvents(prev => [
        ...prev,
        {
          id: createdSchedule.id,
          title: recipes.find(r => r.id === createdSchedule.recipe_id)?.title || "Nova Receita",
          start: new Date(createdSchedule.scheduled_date),
          end: new Date(createdSchedule.scheduled_date),
          recipeId: createdSchedule.recipe_id,
        },
      ]);

      setShowModal(false);
      setSelectedRecipeId(null);
    } catch (error) {
      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) {
        try {
          const errorResponse = JSON.parse(error.message);
          errorMessage = errorResponse.detail || error.message;
        } catch {
          errorMessage = error.message;
        }
      }
      alert(`Erro ao criar agendamento: ${errorMessage}`);
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <InsiderHeader />

        <div className="flex pt-4">
          <div className="hidden sm:block">
            <Sidebar />
          </div>

          <main className="flex-1 p-4 sm:ml-64">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-4xl text-orange-600 text-center mb-6">
                Agenda de Receitas
              </h1>
              
              <div className="bg-white rounded-lg shadow-md p-4" style={{ height: '70vh', minWidth: 0 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  view={calendarView}
                  onView={(view) => setCalendarView(view)}
                  views={['month', 'week', 'day', 'agenda']}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  culture="pt-BR"
                  messages={{
                    today: 'Hoje',
                    previous: 'Anterior',
                    next: 'Próximo',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Lista',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Receita',
                    noEventsInRange: 'Não há receitas agendadas nesse período',
                  }}
                  eventPropGetter={(event: RecipeEvent) => ({
                    style: {
                      backgroundColor: '#f97316',
                      borderColor: '#ea580c',
                      borderRadius: '4px',
                      color: 'white',
                    },
                  })}
                />
              </div>

              {/* Botão de ação flutuante */}
              <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 z-30 cursor-pointer"
              >
                <FaPlus className="text-xl" />
              </button>

              {/* Modal para adicionar receita */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Agendar Refeição</h2>
                    {recipes.length > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1">Receita</label>
                          <select
                            value={selectedRecipeId || ''}
                            onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                          >
                            <option value="">Selecione uma receita</option>
                            {recipes.map(recipe => (
                              <option key={recipe.id} value={recipe.id}>
                                {recipe.title}
                              </option>
                            ))}
                          </select>
                        </div>
                                                
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setShowModal(false);
                              setSelectedRecipeId(null);
                            }}
                            className="px-4 py-2 border rounded cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={handleAddRecipe}
                            className="px-4 py-2 bg-orange-500 text-white rounded flex items-center gap-1 cursor-pointer"
                            disabled={!selectedRecipeId}
                          >
                            <FaPlus /> Agendar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p>Nenhuma receita disponível</p>
                        <button 
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 border rounded cursor-pointer"
                        >
                          Fechar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}