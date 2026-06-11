import { useState } from 'react';
import { Plus, MapPin, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { VISIT_STATUSES } from '../lib/constants';
import { formatDate } from '../lib/utils';
import type { VisitStatus } from '../types';

const statusVariant: Record<VisitStatus, 'green' | 'orange' | 'red' | 'gray' | 'blue'> = {
  agendada: 'blue', realizada: 'green', reagendada: 'orange', cancelada: 'red',
};

export function Visits() {
  const { visits, customers, users, addVisit, updateVisit, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customer_id: '', responsible_user_id: '', visit_date: '', objective: '',
    result: '', notes: '', status: 'agendada' as VisitStatus, photos: [] as string[],
  });

  function handleSubmit() {
    if (!form.customer_id || !form.visit_date || !form.objective) return;
    const customer = customers.find(c => c.id === form.customer_id);
    const responsible = users.find(u => u.id === form.responsible_user_id) ?? currentUser ?? undefined;
    addVisit({ ...form, customer, responsible });
    setShowForm(false);
    setForm({ customer_id: '', responsible_user_id: '', visit_date: '', objective: '', result: '', notes: '', status: 'agendada', photos: [] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Visitas Técnicas</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Nova Visita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visits.map(v => (
          <div key={v.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={statusVariant[v.status]}>{VISIT_STATUSES.find(s => s.id === v.status)?.label}</Badge>
                  <span className="text-xs text-gray-400">📅 {formatDate(v.visit_date)}</span>
                </div>
                <div className="font-semibold text-ks-gray-dark">{v.customer?.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} /> {v.customer?.city} · 👤 {v.responsible?.name}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-xs text-gray-400 uppercase">Objetivo: </span>{v.objective}
                </div>
                {v.result && (
                  <div className="mt-1 text-sm text-ks-gray-dark">
                    <span className="font-medium text-xs text-gray-400 uppercase">Resultado: </span>{v.result}
                  </div>
                )}
                {v.notes && <p className="text-xs text-gray-500 mt-1 bg-ks-gray-light p-2 rounded-lg">{v.notes}</p>}
              </div>
              <div className="flex flex-col gap-2">
                {v.status === 'agendada' && (
                  <button
                    className="btn-secondary text-xs px-2 py-1.5"
                    onClick={() => updateVisit(v.id, { status: 'realizada' })}
                  >
                    ✓ Realizada
                  </button>
                )}
              </div>
            </div>
            {v.photos.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {v.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-20 h-16 object-cover rounded-lg border border-ks-gray-medium" />
                ))}
              </div>
            )}
          </div>
        ))}
        {visits.length === 0 && (
          <div className="card text-center py-12 text-gray-400 lg:col-span-2">
            <MapPin size={32} className="mx-auto mb-2 opacity-30" />
            Nenhuma visita registrada.
          </div>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nova Visita Técnica" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Cliente *" value={form.customer_id} onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))} options={customers.map(c => ({ value: c.id, label: c.name }))} />
          <Select label="Responsável" value={form.responsible_user_id} onChange={e => setForm(f => ({ ...f, responsible_user_id: e.target.value }))} options={users.map(u => ({ value: u.id, label: u.name }))} />
          <Input label="Data e Hora *" type="datetime-local" value={form.visit_date} onChange={e => setForm(f => ({ ...f, visit_date: e.target.value }))} />
          <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as VisitStatus }))} options={VISIT_STATUSES.map(s => ({ value: s.id, label: s.label }))} />
          <div className="sm:col-span-2">
            <Textarea label="Objetivo *" value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} placeholder="Qual o objetivo da visita?" />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Resultado" value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="Resultado da visita (preencher após realizada)" />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Observações" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações adicionais..." />
          </div>
          <div className="sm:col-span-2">
            <label className="label flex items-center gap-1"><Camera size={12} /> Fotos</label>
            <div className="border-2 border-dashed border-ks-gray-medium rounded-lg p-6 text-center text-sm text-gray-400">
              📸 Arraste fotos ou clique para selecionar<br />
              <span className="text-xs">(Integração com Supabase Storage)</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}><Plus size={16} /> Salvar Visita</button>
        </div>
      </Modal>
    </div>
  );
}
