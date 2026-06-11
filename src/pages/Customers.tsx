import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Phone, Users as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { FUNNEL_STAGES, PRODUCER_TYPES, INTERESTS } from '../lib/constants';
import { formatDate, isOverdue } from '../lib/utils';
import type { FunnelStage, ProducerType, InterestType } from '../types';

const stageBadge: Record<FunnelStage, { label: string; variant: 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'purple' | 'yellow' }> = {
  novo_contato: { label: 'Novo Contato', variant: 'gray' },
  em_atendimento: { label: 'Em Atendimento', variant: 'blue' },
  orcamento_enviado: { label: 'Orçamento Enviado', variant: 'yellow' },
  acompanhamento: { label: 'Acompanhamento', variant: 'purple' },
  venda_realizada: { label: 'Venda Realizada', variant: 'green' },
  pos_venda: { label: 'Pós-venda', variant: 'blue' },
  perdido: { label: 'Perdido', variant: 'red' },
};

const emptyForm = {
  name: '', phone: '', whatsapp: '', city: '', region_line: '', farm_name: '',
  producer_type: 'cafeicultor' as ProducerType, responsible_user_id: '',
  funnel_stage: 'novo_contato' as FunnelStage, next_action: '', next_action_date: '',
  notes: '', status: 'ativo' as const, interests: [] as InterestType[], source: '',
};

export function Customers() {
  const { customers, users, addCustomer } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterSeller, setFilterSeller] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = customers.filter(c => {
    const matchSearch = !search || [c.name, c.phone, c.city, c.region_line].some(f => f.toLowerCase().includes(search.toLowerCase()));
    const matchStage = !filterStage || c.funnel_stage === filterStage;
    const matchSeller = !filterSeller || c.responsible_user_id === filterSeller;
    return matchSearch && matchStage && matchSeller;
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome obrigatório';
    if (!form.phone.trim()) e.phone = 'Telefone obrigatório';
    if (!form.city.trim()) e.city = 'Município obrigatório';
    if (!form.responsible_user_id) e.responsible_user_id = 'Responsável obrigatório';
    if (!form.next_action.trim()) e.next_action = 'Próxima ação obrigatória';
    if (!form.next_action_date) e.next_action_date = 'Data da próxima ação obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const responsible = users.find(u => u.id === form.responsible_user_id);
    addCustomer({ ...form, responsible, campaign_id: undefined });
    setShowForm(false);
    setForm({ ...emptyForm });
  }

  function toggleInterest(id: InterestType) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter(i => i !== id) : [...f.interests, id],
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ks-gray-dark">Clientes</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Buscar por nome, telefone, município..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input sm:w-44" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
            <option value="">Todas as etapas</option>
            {FUNNEL_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select className="input sm:w-44" value={filterSeller} onChange={e => setFilterSeller(e.target.value)}>
            <option value="">Todos vendedores</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 text-sm text-gray-500">
        <span className="font-medium text-ks-gray-dark">{filtered.length}</span> clientes encontrados
        {filtered.filter(c => isOverdue(c.next_action_date)).length > 0 && (
          <span className="badge-red ml-2">
            {filtered.filter(c => isOverdue(c.next_action_date)).length} com retorno atrasado
          </span>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ks-gray-medium">
              {['Cliente', 'Município', 'Responsável', 'Etapa', 'Próxima Ação', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const overdue = isOverdue(c.next_action_date);
              const sb = stageBadge[c.funnel_stage];
              return (
                <tr key={c.id} className="border-b border-ks-gray-light hover:bg-ks-gray-light/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-ks-gray-dark">{c.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {c.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{c.city}</div>
                    {c.region_line && <div className="text-xs text-gray-400">{c.region_line}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.responsible?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-xs font-medium ${overdue ? 'text-ks-danger' : 'text-gray-600'}`}>
                      {overdue && '⚠️ '}{c.next_action}
                    </div>
                    <div className={`text-xs mt-0.5 ${overdue ? 'text-ks-danger' : 'text-gray-400'}`}>
                      {formatDate(c.next_action_date)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-ks-green-light text-ks-green transition-colors" title="Ver ficha" onClick={() => navigate(`/clientes/${c.id}`)}>
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-ks-orange-light text-ks-orange transition-colors" title="Editar">
                        <Edit2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UserIcon size={32} className="mx-auto mb-2 opacity-40" />
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      {/* Modal novo cliente */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setErrors({}); }} title="Novo Cliente" size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} placeholder="Nome completo" />
          <Input label="Telefone *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} error={errors.phone} placeholder="(69) 9..." />
          <Input label="WhatsApp" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="(69) 9..." />
          <Input label="Município *" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} error={errors.city} placeholder="Cacoal" />
          <Input label="Linha / Ramal" value={form.region_line} onChange={e => setForm(f => ({ ...f, region_line: e.target.value }))} placeholder="Linha 9" />
          <Input label="Fazenda / Propriedade" value={form.farm_name} onChange={e => setForm(f => ({ ...f, farm_name: e.target.value }))} placeholder="Fazenda Boa Esperança" />
          <Select
            label="Tipo de Produtor"
            value={form.producer_type}
            onChange={e => setForm(f => ({ ...f, producer_type: e.target.value as ProducerType }))}
            options={PRODUCER_TYPES.map(p => ({ value: p.id, label: p.label }))}
          />
          <Select
            label="Responsável *"
            value={form.responsible_user_id}
            onChange={e => setForm(f => ({ ...f, responsible_user_id: e.target.value }))}
            options={users.filter(u => u.is_active).map(u => ({ value: u.id, label: u.name }))}
            error={errors.responsible_user_id}
          />
          <Select
            label="Etapa do Funil"
            value={form.funnel_stage}
            onChange={e => setForm(f => ({ ...f, funnel_stage: e.target.value as FunnelStage }))}
            options={FUNNEL_STAGES.map(s => ({ value: s.id, label: s.label }))}
          />
          <Select
            label="Origem"
            value={form.source || ''}
            onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
            options={['Instagram', 'WhatsApp', 'Grupo de Promoções', 'Ligação', 'Visita', 'Feira', 'Indicação'].map(s => ({ value: s, label: s }))}
          />

          <div className="sm:col-span-2">
            <label className="label">Interesses (múltipla seleção)</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {INTERESTS.map(i => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => toggleInterest(i.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.interests.includes(i.id) ? 'bg-ks-green text-white border-ks-green' : 'bg-white text-gray-600 border-ks-gray-medium hover:border-ks-green'}`}
                >
                  {i.emoji} {i.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Próxima Ação *"
            value={form.next_action}
            onChange={e => setForm(f => ({ ...f, next_action: e.target.value }))}
            error={errors.next_action}
            placeholder="Ex: Enviar orçamento de irrigação"
          />
          <Input
            label="Data da Próxima Ação *"
            type="date"
            value={form.next_action_date}
            onChange={e => setForm(f => ({ ...f, next_action_date: e.target.value }))}
            error={errors.next_action_date}
          />
          <div className="sm:col-span-2">
            <Textarea label="Observações" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Informações relevantes sobre o cliente..." />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>
            <Plus size={16} /> Salvar Cliente
          </button>
        </div>
      </Modal>
    </div>
  );
}
