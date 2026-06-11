import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TASK_TYPES } from '../lib/constants';

export function Schedule() {
  const { tasks, visits } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthStr = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  function getEventsForDay(day: number) {
    const dateStr = new Date(year, month, day).toDateString();
    const dayTasks = tasks.filter(t => new Date(t.due_date).toDateString() === dateStr);
    const dayVisits = visits.filter(v => new Date(v.visit_date).toDateString() === dateStr);
    return { tasks: dayTasks, visits: dayVisits };
  }

  const todayEvents = getEventsForDay(new Date().getDate());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Agenda</h1>
        <button className="btn-primary"><Plus size={16} /> Novo Evento</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <button className="p-1.5 rounded-lg hover:bg-ks-gray-light" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-semibold text-ks-gray-dark capitalize">{monthStr}</h2>
            <button className="p-1.5 rounded-lg hover:bg-ks-gray-light" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
            {blanks.map(b => <div key={`b${b}`} />)}
            {days.map(day => {
              const events = getEventsForDay(day);
              const total = events.tasks.length + events.visits.length;
              const isToday = new Date(year, month, day).toDateString() === new Date().toDateString();
              return (
                <div
                  key={day}
                  className={`relative p-1.5 rounded-lg text-sm cursor-pointer transition-colors ${isToday ? 'bg-ks-green text-white font-bold' : 'hover:bg-ks-gray-light'}`}
                >
                  <div>{day}</div>
                  {total > 0 && (
                    <div className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${isToday ? 'bg-white text-ks-green' : 'bg-ks-orange text-white'}`}>
                      {total}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-ks-gray-medium">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-ks-orange inline-block" /> Tarefas/Ligações</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-ks-green inline-block" /> Visitas</span>
              <span className="text-ks-orange font-medium">Integração Google Calendar em breve</span>
            </div>
          </div>
        </div>

        {/* Today panel */}
        <div className="space-y-3">
          <div className="card">
            <h2 className="font-semibold text-ks-gray-dark mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-ks-green" /> Hoje
            </h2>
            {todayEvents.tasks.length === 0 && todayEvents.visits.length === 0 ? (
              <p className="text-sm text-gray-400">Sem eventos hoje.</p>
            ) : (
              <div className="space-y-2">
                {todayEvents.tasks.map(t => (
                  <div key={t.id} className="p-2 bg-ks-orange-light rounded-lg">
                    <div className="text-xs font-semibold text-ks-orange-dark">{TASK_TYPES.find(tt => tt.id === t.type)?.label}</div>
                    <div className="text-sm font-medium text-ks-gray-dark">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.customer?.name}</div>
                  </div>
                ))}
                {todayEvents.visits.map(v => (
                  <div key={v.id} className="p-2 bg-ks-green-light rounded-lg">
                    <div className="text-xs font-semibold text-ks-green">Visita Técnica</div>
                    <div className="text-sm font-medium text-ks-gray-dark">{v.customer?.name}</div>
                    <div className="text-xs text-gray-500">{v.objective}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card bg-ks-green-light border border-ks-green/20">
            <div className="text-sm font-semibold text-ks-green mb-1 flex items-center gap-1">
              🔗 Google Calendar
            </div>
            <p className="text-xs text-gray-600">
              Integração com Google Calendar em breve. Todas as tarefas e visitas serão sincronizadas automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
