import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { TASK_TYPES } from '../lib/constants';

const emptyForm = {
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  start_time: '08:00',
  end_time: '09:00',
};

export function Schedule() {
  const { tasks, visits, currentUser } = useApp();
  const { isConnected, login, createEvent } = useGoogleCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthStr = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  function getEventsForDay(day: number) {
    const dateStr = new Date(year, month, day).toDateString();
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';
    const dayTasks = tasks.filter(t => {
      const matches = new Date(t.due_date).toDateString() === dateStr;
      return matches && (isAdmin || t.assigned_to === currentUser?.id);
    });
    const dayVisits = visits.filter(v => {
      const matches = new Date(v.visit_date).toDateString() === dateStr;
      return matches && (isAdmin || v.user_id === currentUser?.id);
    });
    return { tasks: dayTasks, visits: dayVisits };
  }

  const viewDay = selectedDay ?? new Date().getDate();
  const viewEvents = getEventsForDay(viewDay);

  async function handleCreateEvent() {
    if (!form.title.trim()) return;
    setSaving(true);
    setSyncError('');
    setSyncSuccess(false);

    if (isConnected) {
      const startISO = `${form.date}T${form.start_time}:00`;
      const endISO = `${form.date}T${form.end_time}:00`;
      const { error } = await createEvent({
        title: form.title,
        description: form.description,
        start: startISO,
        end: endISO,
      });
      if (error) {
        setSyncError(error);
      } else {
        setSyncSuccess(true);
        setTimeout(() => {
          setShowForm(false);
          setForm({ ...emptyForm });
          setSyncSuccess(false);
        }, 1500);
      }
    } else {
      setShowForm(false);
      setForm({ ...emptyForm });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Agenda</h1>
        <button className="btn-primary" onClick={() => { setShowForm(true); setSyncError(''); setSyncSuccess(false); }}>
          <Plus size={16} /> Novo Evento
        </button>
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
              const isSelected = selectedDay === day;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-1.5 rounded-lg text-sm cursor-pointer transition-colors
                    ${isToday ? 'bg-ks-green text-white font-bold' : ''}
                    ${isSelected && !isToday ? 'bg-ks-green-light ring-2 ring-ks-green' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-ks-gray-light' : ''}
                  `}
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
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-ks-orange inline-block" /> Tarefas/Ligações</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-ks-green inline-block" /> Visitas</span>
              {isConnected
                ? <span className="flex items-center gap-1 text-blue-600 font-medium">📅 Google Calendar conectado</span>
                : <span className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-blue-600" onClick={() => login()}>📅 Conectar Google Calendar</span>
              }
            </div>
          </div>
        </div>

        {/* Day panel */}
        <div className="space-y-3">
          <div className="card">
            <h2 className="font-semibold text-ks-gray-dark mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-ks-green" />
              {selectedDay
                ? new Date(year, month, selectedDay).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
                : 'Hoje'
              }
            </h2>
            {viewEvents.tasks.length === 0 && viewEvents.visits.length === 0 ? (
              <p className="text-sm text-gray-400">Sem eventos neste dia.</p>
            ) : (
              <div className="space-y-2">
                {viewEvents.tasks.map(t => (
                  <div key={t.id} className="p-2 bg-ks-orange-light rounded-lg">
                    <div className="text-xs font-semibold text-ks-orange-dark">{TASK_TYPES.find(tt => tt.id === t.type)?.label}</div>
                    <div className="text-sm font-medium text-ks-gray-dark">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.customer?.name}</div>
                  </div>
                ))}
                {viewEvents.visits.map(v => (
                  <div key={v.id} className="p-2 bg-ks-green-light rounded-lg">
                    <div className="text-xs font-semibold text-ks-green">Visita Técnica</div>
                    <div className="text-sm font-medium text-ks-gray-dark">{v.customer?.name}</div>
                    <div className="text-xs text-gray-500">{v.objective}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`card border ${isConnected ? 'bg-blue-50 border-blue-200' : 'bg-ks-gray-light border-ks-gray-medium'}`}>
            <div className={`text-sm font-semibold mb-1 flex items-center gap-1 ${isConnected ? 'text-blue-600' : 'text-gray-500'}`}>
              📅 Google Calendar
            </div>
            {isConnected ? (
              <p className="text-xs text-gray-600">Conectado. Novos eventos criados aqui serão enviados automaticamente para seu Google Calendar.</p>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-2">Conecte seu Google Calendar para sincronizar seus eventos.</p>
                <button className="text-xs text-blue-600 font-medium hover:underline" onClick={() => login()}>
                  Conectar agora →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal novo evento */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Novo Evento" size="md">
        <div className="space-y-4">
          <Input
            label="Título *"
            placeholder="Ex: Visita ao cliente, Reunião..."
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <Textarea
            label="Descrição"
            placeholder="Detalhes do evento..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Data *"
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Início"
              type="time"
              value={form.start_time}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
            />
            <Input
              label="Fim"
              type="time"
              value={form.end_time}
              onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
            />
          </div>

          {!isConnected && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>Google Calendar não conectado. O evento não será sincronizado. <button className="underline font-medium" onClick={() => login()}>Conectar agora</button></span>
            </div>
          )}

          {syncError && (
            <div className="bg-ks-danger-light text-ks-danger text-sm rounded-lg px-3 py-2">⚠️ {syncError}</div>
          )}
          {syncSuccess && (
            <div className="bg-ks-green-light text-ks-green text-sm rounded-lg px-3 py-2">✅ Evento criado e sincronizado com o Google Calendar!</div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleCreateEvent} disabled={saving || !form.title.trim()}>
            {saving ? 'Salvando...' : isConnected ? <><Calendar size={16} /> Criar e Sincronizar</> : <><Plus size={16} /> Criar Evento</>}
          </button>
        </div>
      </Modal>
    </div>
  );
}
