import { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { TASK_TYPES, TASK_PRIORITIES } from '../lib/constants';
import { formatDate, isOverdue } from '../lib/utils';
import type { TaskType, TaskPriority, TaskStatus } from '../types';

type Tab = 'hoje' | 'proximos' | 'atrasadas' | 'concluidas';

const statusVariant: Record<TaskStatus, 'green' | 'orange' | 'red' | 'gray' | 'blue'> = {
  pendente: 'gray', em_andamento: 'blue', concluida: 'green', atrasada: 'red', cancelada: 'gray',
};

const priorityColor = { baixa: 'bg-gray-300', media: 'bg-ks-orange', alta: 'bg-ks-danger' };

const emptyForm = {
  customer_id: '', responsible_user_id: '', type: 'ligar' as TaskType,
  title: '', description: '', due_date: '', status: 'pendente' as TaskStatus, priority: 'media' as TaskPriority,
};

export function Tasks() {
  const { tasks, customers, users, addTask, updateTask, currentUser } = useApp();
  const [tab, setTab] = useState<Tab>('hoje');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const today = new Date().toDateString();

  const filtered = tasks.filter(t => {
    if (tab === 'hoje') return new Date(t.due_date).toDateString() === today && t.status !== 'concluida' && t.status !== 'cancelada';
    if (tab === 'proximos') {
      const d = new Date(t.due_date);
      const now = new Date();
      return d > now && d.toDateString() !== today && t.status !== 'concluida' && t.status !== 'cancelada';
    }
    if (tab === 'atrasadas') return isOverdue(t.due_date) && t.status !== 'concluida' && t.status !== 'cancelada';
    return t.status === 'concluida';
  });

  const counts = {
    hoje: tasks.filter(t => new Date(t.due_date).toDateString() === today && t.status !== 'concluida' && t.status !== 'cancelada').length,
    proximos: tasks.filter(t => { const d = new Date(t.due_date); const now = new Date(); return d > now && d.toDateString() !== today && t.status !== 'concluida'; }).length,
    atrasadas: tasks.filter(t => isOverdue(t.due_date) && t.status !== 'concluida' && t.status !== 'cancelada').length,
    concluidas: tasks.filter(t => t.status === 'concluida').length,
  };

  function handleSubmit() {
    if (!form.title.trim() || !form.due_date) return;
    const customer = customers.find(c => c.id === form.customer_id);
    const responsible = users.find(u => u.id === form.responsible_user_id) ?? currentUser ?? undefined;
    addTask({ ...form, customer, responsible, responsible_user_id: responsible?.id ?? '' });
    setShowForm(false);
    setForm({ ...emptyForm });
  }

  const tabs: { id: Tab; label: string; icon: typeof Clock; color: string }[] = [
    { id: 'hoje', label: `Hoje (${counts.hoje})`, icon: Clock, color: 'text-blue-600' },
    { id: 'proximos', label: `Próximos (${counts.proximos})`, icon: CheckCircle, color: 'text-ks-green' },
    { id: 'atrasadas', label: `Atrasadas (${counts.atrasadas})`, icon: AlertTriangle, color: 'text-ks-danger' },
    { id: 'concluidas', label: `Concluídas (${counts.concluidas})`, icon: CheckCircle, color: 'text-gray-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Tarefas</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Nova Tarefa
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ks-gray-light p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === t.id ? 'bg-white shadow text-ks-gray-dark' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <t.icon size={14} className={tab === t.id ? t.color : ''} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
            Nenhuma tarefa nesta seção.
          </div>
        )}
        {filtered.map(t => {
          const overdue = isOverdue(t.due_date) && t.status !== 'concluida';
          return (
            <div key={t.id} className={`card flex items-start gap-4 ${overdue ? 'border-l-4 border-l-ks-danger' : ''}`}>
              <button
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${t.status === 'concluida' ? 'bg-ks-green border-ks-green' : 'border-ks-gray-medium hover:border-ks-green'}`}
                onClick={() => updateTask(t.id, { status: t.status === 'concluida' ? 'pendente' : 'concluida' })}
              >
                {t.status === 'concluida' && <CheckCircle size={12} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityColor[t.priority]}`} />
                  <span className={`font-medium text-sm ${t.status === 'concluida' ? 'line-through text-gray-400' : 'text-ks-gray-dark'}`}>{t.title}</span>
                  <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                </div>
                {t.description && <p className="text-xs text-gray-500 mt-0.5 ml-4">{t.description}</p>}
                <div className="flex flex-wrap gap-3 mt-1.5 ml-4 text-xs text-gray-400">
                  {t.customer && <span>👤 {t.customer.name}</span>}
                  {t.responsible && <span>🧑‍💼 {t.responsible.name}</span>}
                  <span className={overdue ? 'text-ks-danger font-medium' : ''}>
                    📅 {formatDate(t.due_date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {t.status !== 'concluida' && t.status !== 'cancelada' && (
                  <button
                    className="p-1.5 rounded-lg hover:bg-ks-danger-light text-gray-400 hover:text-ks-danger transition-colors"
                    title="Cancelar"
                    onClick={() => updateTask(t.id, { status: 'cancelada' })}
                  >
                    <XCircle size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nova Tarefa" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Cliente"
            value={form.customer_id}
            onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}
            options={customers.map(c => ({ value: c.id, label: c.name }))}
          />
          <Select
            label="Responsável"
            value={form.responsible_user_id}
            onChange={e => setForm(f => ({ ...f, responsible_user_id: e.target.value }))}
            options={users.map(u => ({ value: u.id, label: u.name }))}
          />
          <Select
            label="Tipo"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as TaskType }))}
            options={TASK_TYPES.map(t => ({ value: t.id, label: t.label }))}
          />
          <Select
            label="Prioridade"
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
            options={TASK_PRIORITIES.map(p => ({ value: p.id, label: p.label }))}
          />
          <div className="sm:col-span-2">
            <Input label="Título *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Descreva a tarefa brevemente" />
          </div>
          <Input label="Data e Hora *" type="datetime-local" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
          <div className="sm:col-span-2">
            <Textarea label="Descrição" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detalhes adicionais..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}><Plus size={16} /> Criar Tarefa</button>
        </div>
      </Modal>
    </div>
  );
}
