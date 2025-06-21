"use client"

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {format} from 'date-fns/format';
import {parse} from 'date-fns/parse';
import {startOfWeek} from 'date-fns/startOfWeek';
import {getDay} from 'date-fns/getDay';
import {ptBR} from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus } from 'react-icons/fa';
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from '@/components/ProtectedPage';

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
  const [events, setEvents] = useState<RecipeEvent[]>([
    {
      id: 1,
      title: "Lasanha Vegetariana",
      start: new Date(2023, 10, 15, 12, 0),
      end: new Date(2023, 10, 15, 13, 0),
      recipeId: 101
    },
    {
      id: 2,
      title: "Strogonoff de Frango",
      start: new Date(2023, 10, 16, 19, 0),
      end: new Date(2023, 10, 16, 20, 0),
      recipeId: 102
    }
  ]);

  const [calendarView, setCalendarView] = useState<'week' | 'agenda'>('week');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
   
  useEffect(() => {
    const handleResize = () => {
      setCalendarView(window.innerWidth < 640 ? 'agenda' : 'week');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
 }, []);
 
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setShowModal(true);
  };

  const handleAddRecipe = (recipeTitle: string) => {
    if (!selectedSlot) return;
    
    const newEvent: RecipeEvent = {
      id: Date.now(),
      title: recipeTitle,
      start: selectedSlot.start,
      end: selectedSlot.end,
      recipeId: Math.floor(Math.random() * 1000)
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
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
                className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 z-30"
              >
                <FaPlus className="text-xl" />
              </button>

              {/* Modal para adicionar receita (simplificado) */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Adicionar Receita</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1">Nome da Receita</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded"
                          placeholder="Ex: Feijoada Light"
                          id="recipe-name"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 border rounded"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => {
                            const input = document.getElementById('recipe-name') as HTMLInputElement;
                            if (input.value) {
                              handleAddRecipe(input.value);
                            }
                          }}
                          className="px-4 py-2 bg-orange-500 text-white rounded flex items-center gap-1"
                        >
                          <FaPlus /> Adicionar
                        </button>
                      </div>
                    </div>
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