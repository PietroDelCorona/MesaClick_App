"use client"

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus } from 'react-icons/fa';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from '@/components/ProtectedPage';
import { getMySchedules, createSchedule } from '@/services/scheduleService';
import { getMyRecipes, getRecipes } from '@/services/recipeService';
import { Recipe } from '@/types/recipe';
import toast from 'react-hot-toast';


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

const now = new Date()

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [systemRecipes, setSystemRecipes] = useState<Recipe[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [mealType] = useState('lunch');
  const [portions] = useState(1);
  const [showRecipeList, setShowRecipeList] = useState(false);

  const recipes = [...myRecipes, ...systemRecipes];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [schedules, systemRecipesData, myRecipesData] = await Promise.all([
          getMySchedules(token),
          getRecipes(token),
          getMyRecipes(token),
        ]);

        setSystemRecipes(systemRecipesData);
        setMyRecipes(myRecipesData);

        setEvents(schedules.map(schedule => {
          const utcDate = new Date(schedule.scheduled_date);
          const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
          return {
            id: schedule.id,
            title: (myRecipesData.concat(systemRecipesData).find(r => r.id === schedule.recipe_id)?.title) || "Receita Agendada",
            start: localDate,
            end: localDate,
            recipeId: schedule.recipe_id,
          };
        }));
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
      const utcISOString = selectedSlot.start.toISOString();

      const newSchedule = {
        scheduled_date: utcISOString,
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
      setSearchText('');
      toast.success("Receita agendada com sucesso!")
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

              <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer" style={{ height: '70vh', minWidth: 0 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  scrollToTime={new Date(0, 0, 0, now.getHours(), now.getMinutes(), 0)}
                  view={calendarView}
                  date={currentDate}
                  onView={(view) => {
                    if (view === "month" || view === "week" || view === "day" || view === "agenda") {
                      setCalendarView(view);
                    }
                  }}
                  onNavigate={(date) => setCurrentDate(date)}
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
                  
                />
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 z-30 cursor-pointer"
              >
                <FaPlus className="text-xl" />
              </button>

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Agendar Refeição</h2>

                    {(recipes.length > 0) ? (
                      <div className="space-y-4">
                        {selectedSlot && (
                          <div className="text-orange-600">
                            <span className="font-medium">Data e hora selecionada:</span><br />
                            {selectedSlot.start.toLocaleDateString()} {selectedSlot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}

                        <div>
                          <label className="block mb-1">Buscar Receita</label>
                          <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => setShowRecipeList(true)}
                            onBlur={() => setTimeout(() => setShowRecipeList(false), 200)}
                            placeholder="Clique para buscar"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        {(showRecipeList || searchText.length > 0) && (
                          <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-1 mt-2">
                            {filteredRecipes.map(recipe => (
                              <div
                                key={recipe.id}
                                onClick={() => setSelectedRecipeId(recipe.id)}
                                className={`p-2 rounded cursor-pointer ${selectedRecipeId === recipe.id ? 'bg-orange-100' : 'hover:bg-gray-100'}`}
                              >
                                {recipe.title}
                              </div>
                            ))}
                            {filteredRecipes.length === 0 && (
                              <p className="text-sm text-gray-500 text-center">Nenhuma receita encontrada.</p>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block mb-1">Ou selecione manualmente</label>
                          <select
                            value={selectedRecipeId || ''}
                            onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                          >
                            <optgroup label="Minhas Receitas">
                              {myRecipes.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Receitas do Sistema">
                              {systemRecipes.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setShowModal(false);
                              setSelectedRecipeId(null);
                              setSearchText('');
                            }}
                            className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleAddRecipe}
                            className="px-4 py-2 bg-orange-500 text-white rounded flex items-center gap-1 cursor-pointer hover:bg-orange-600"
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
                          className="px-4 py-2 border rounded cursor-pointer hover:bg-grey-300"
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
