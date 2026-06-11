import { useState } from 'react';
import { Plus, FileText, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { QUOTE_CATEGORIES, QUOTE_STATUSES } from '../lib/constants';
import { formatDate, formatCurrency } from '../lib/utils';
import type { QuoteCategory, QuoteStatus } from '../types';

const statusVariant: Record<QuoteStatus, 'green' | 'orange' | 'red' | 'gray'> = {
  enviado: 'gray', em_negociacao: 'orange', aprovado: 'green', perdido: 'red',
};

export function Quotes() {
  const { quotes, customers, users, addQuote, updateQuote, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    customer_id: '', responsible_user_id: '', product: '', category: 'irrigacao' as QuoteCategory,
    value: 0, status: 'enviado' as QuoteStatus, notes: '', quote_date: new Date().toISOString().split('T')[0],
  });

  const filtered = quotes.filter(q => !filterStatus || q.status === filterStatus);
  const totalApproved = quotes.filter(q => q.status === 'aprovado').reduce((s, q) => s + q.value, 0);
  const totalPending = quotes.filter(q => ['enviado', 'em_negociacao'].includes(q.status)).reduce((s, q) => s + q.value, 0);

  function handleSubmit() {
    if (!form.product || !form.customer_id) return;
    const customer = customers.find(c => c.id === form.customer_id);
    const responsible = users.find(u => u.id === form.responsible_user_id) ?? currentUser ?? undefined;
    addQuote({ ...form, customer, responsible });
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Orçamentos</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Novo Orçamento</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-ks-green">
          <div className="text-xs text-gray-500 uppercase">Vendas Aprovadas</div>
          <div className="text-xl font-bold text-ks-green mt-1">{formatCurrency(totalApproved)}</div>
        </div>
        <div className="card border-l-4 border-l-ks-orange">
          <div className="text-xs text-gray-500 uppercase">Em Negociação</div>
          <div className="text-xl font-bold text-ks-orange mt-1">{formatCurrency(totalPending)}</div>
        </div>
        <div className="card border-l-4 border-l-blue-500">
          <div className="text-xs text-gray-500 uppercase">Total de Orçamentos</div>
          <div className="text-xl font-bold text-ks-gray-dark mt-1">{quotes.length}</div>
        </div>
      </div>

      <div className="card p-3">
        <select className="input w-48" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {QUOTE_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ks-gray-medium">
              {['Cliente', 'Produto', 'Categoria', 'Valor', 'Data', 'Status', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => (
              <tr key={q.id} className="border-b border-ks-gray-light hover:bg-ks-gray-light/50">
                <td className="px-4 py-3 font-medium">{q.customer?.name}</td>
                <td className="px-4 py-3 text-gray-600">{q.product}</td>
                <td className="px-4 py-3"><Badge variant="gray">{QUOTE_CATEGORIES.find(c => c.id === q.category)?.label}</Badge></td>
                <td className="px-4 py-3 font-semibold text-ks-green">{formatCurrency(q.value)}</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(q.quote_date)}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant[q.status]}>{QUOTE_STATUSES.find(s => s.id === q.status)?.label}</Badge></td>
                <td className="px-4 py-3">
                  {q.status === 'em_negociacao' && (
                    <button className="btn-secondary text-xs px-2 py-1" onClick={() => updateQuote(q.id, { status: 'aprovado' })}>
                      <TrendingUp size={12} /> Aprovar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400"><FileText size={32} className="mx-auto mb-2 opacity-30" />Nenhum orçamento.</div>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Novo Orçamento" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Cliente *" value={form.customer_id} onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))} options={customers.map(c => ({ value: c.id, label: c.name }))} />
          <Select label="Responsável" value={form.responsible_user_id} onChange={e => setForm(f => ({ ...f, responsible_user_id: e.target.value }))} options={users.map(u => ({ value: u.id, label: u.name }))} />
          <div className="sm:col-span-2">
            <Input label="Produto / Serviço *" value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="Descreva o produto ou serviço" />
          </div>
          <Select label="Categoria" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as QuoteCategory }))} options={QUOTE_CATEGORIES.map(c => ({ value: c.id, label: c.label }))} />
          <Input label="Valor (R$)" type="number" value={String(form.value)} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} placeholder="0,00" />
          <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as QuoteStatus }))} options={QUOTE_STATUSES.map(s => ({ value: s.id, label: s.label }))} />
          <Input label="Data" type="date" value={form.quote_date} onChange={e => setForm(f => ({ ...f, quote_date: e.target.value }))} />
          <div className="sm:col-span-2">
            <Textarea label="Observações" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}><Plus size={16} /> Salvar Orçamento</button>
        </div>
      </Modal>
    </div>
  );
}
