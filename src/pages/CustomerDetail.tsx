import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, User, Calendar, MessageSquare, CheckSquare, FileText, Wrench, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { FUNNEL_STAGES, INTERESTS } from '../lib/constants';
import { formatDate, formatDateTime, isOverdue, formatCurrency } from '../lib/utils';
import { mockHistory } from '../lib/mock-data';
import type { FunnelStage } from '../types';

const stageBadgeVariant: Record<FunnelStage, 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'purple' | 'yellow'> = {
  novo_contato: 'gray', em_atendimento: 'blue', orcamento_enviado: 'yellow',
  acompanhamento: 'purple', venda_realizada: 'green', pos_venda: 'blue', perdido: 'red',
};

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, tasks, visits, quotes, conversations } = useApp();

  const customer = customers.find(c => c.id === id);
  if (!customer) return (
    <div className="text-center py-20 text-gray-400">
      <p>Cliente não encontrado.</p>
      <button className="btn-ghost mt-4" onClick={() => navigate('/clientes')}>Voltar</button>
    </div>
  );

  const customerTasks = tasks.filter(t => t.customer_id === id);
  const customerVisits = visits.filter(v => v.customer_id === id);
  const customerQuotes = quotes.filter(q => q.customer_id === id);
  const customerConvs = conversations.filter(c => c.customer_id === id);
  const history = mockHistory.filter(h => h.customer_id === id);
  const stage = FUNNEL_STAGES.find(s => s.id === customer.funnel_stage);
  const overdue = isOverdue(customer.next_action_date);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button className="btn-ghost px-2 py-2" onClick={() => navigate('/clientes')}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ks-gray-dark">{customer.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={stageBadgeVariant[customer.funnel_stage]}>{stage?.label}</Badge>
            {customer.status === 'inativo' && <Badge variant="red">Inativo</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dados */}
        <div className="card space-y-3">
          <h2 className="font-semibold text-ks-gray-dark border-b pb-2">Dados do Cliente</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>{customer.phone}</span></div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /><span>{customer.city}{customer.region_line ? ` · ${customer.region_line}` : ''}</span></div>
            {customer.farm_name && <div className="flex items-center gap-2"><span className="text-gray-400">🌿</span><span>{customer.farm_name}</span></div>}
            <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /><span>{customer.responsible?.name || '—'}</span></div>
          </div>
          {customer.interests.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Interesses</div>
              <div className="flex flex-wrap gap-1">
                {customer.interests.map(i => {
                  const interest = INTERESTS.find(ii => ii.id === i);
                  return interest ? (
                    <span key={i} className="badge-green text-xs">{interest.emoji} {interest.label}</span>
                  ) : null;
                })}
              </div>
            </div>
          )}
          {customer.notes && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Observações</div>
              <p className="text-sm text-gray-600 bg-ks-gray-light p-2 rounded-lg">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Próxima ação */}
        <div className={`card border-l-4 ${overdue ? 'border-l-ks-danger' : 'border-l-ks-green'}`}>
          <h2 className="font-semibold text-ks-gray-dark border-b pb-2 flex items-center gap-2">
            <Clock size={14} className={overdue ? 'text-ks-danger' : 'text-ks-green'} />
            Próxima Ação
            {overdue && <Badge variant="red">Atrasada</Badge>}
          </h2>
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-ks-gray-dark">{customer.next_action}</p>
            <p className={`text-sm font-semibold ${overdue ? 'text-ks-danger' : 'text-ks-green'}`}>
              <Calendar size={12} className="inline mr-1" />
              {formatDate(customer.next_action_date)}
            </p>
            <p className="text-xs text-gray-500">Responsável: {customer.responsible?.name}</p>
          </div>
        </div>

        {/* Resumo atividades */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark border-b pb-2">Resumo</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: 'Tarefas', value: customerTasks.length, icon: CheckSquare, color: 'text-blue-600' },
              { label: 'Visitas', value: customerVisits.length, icon: Wrench, color: 'text-ks-green' },
              { label: 'Orçamentos', value: customerQuotes.length, icon: FileText, color: 'text-ks-orange' },
              { label: 'Conversas', value: customerConvs.length, icon: MessageSquare, color: 'text-purple-600' },
            ].map(item => (
              <div key={item.label} className="bg-ks-gray-light p-3 rounded-lg">
                <item.icon size={18} className={item.color} />
                <div className="text-lg font-bold text-ks-gray-dark mt-1">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tarefas */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-3 flex items-center gap-2">
            <CheckSquare size={15} className="text-blue-600" /> Tarefas
          </h2>
          {customerTasks.length === 0 ? <p className="text-sm text-gray-400">Nenhuma tarefa.</p> : (
            <div className="space-y-2">
              {customerTasks.map(t => (
                <div key={t.id} className={`p-3 rounded-lg border text-sm ${isOverdue(t.due_date) && t.status !== 'concluida' ? 'border-ks-danger bg-ks-danger-light' : 'border-ks-gray-medium bg-ks-gray-light'}`}>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{formatDate(t.due_date)} · {t.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orçamentos */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-3 flex items-center gap-2">
            <FileText size={15} className="text-ks-orange" /> Orçamentos
          </h2>
          {customerQuotes.length === 0 ? <p className="text-sm text-gray-400">Nenhum orçamento.</p> : (
            <div className="space-y-2">
              {customerQuotes.map(q => (
                <div key={q.id} className="p-3 rounded-lg border border-ks-gray-medium bg-ks-gray-light text-sm">
                  <div className="font-medium">{q.product}</div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-xs text-gray-500">{formatDate(q.quote_date)}</span>
                    <span className="font-semibold text-ks-green">{formatCurrency(q.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Histórico */}
      <div className="card">
        <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
          <Clock size={15} className="text-gray-400" /> Histórico de Atividades
        </h2>
        {history.length === 0 ? <p className="text-sm text-gray-400">Nenhum histórico registrado.</p> : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-ks-gray-medium" />
            <div className="space-y-4">
              {history.map(h => (
                <div key={h.id} className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-ks-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10">
                    {h.user?.name[0]}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm font-medium text-ks-gray-dark">{h.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{h.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatDateTime(h.created_at)} · {h.user?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
