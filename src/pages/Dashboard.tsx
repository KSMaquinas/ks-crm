import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, AlertTriangle, MessageSquare, CheckSquare, DollarSign, Phone, MapPin, Clock } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useApp } from '../context/AppContext';
import { formatDate, formatCurrency, isOverdue, timeAgo } from '../lib/utils';
import { FUNNEL_STAGES } from '../lib/constants';

export function Dashboard() {
  const { customers, tasks, conversations, quotes, visits } = useApp();
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = today.toDateString();

  const activeCustomers = customers.filter(c => c.status === 'ativo').length;
  const openOpportunities = customers.filter(c => !['venda_realizada', 'perdido'].includes(c.funnel_stage)).length;
  const overdueActions = customers.filter(c => isOverdue(c.next_action_date)).length;
  const pendingConversations = conversations.filter(c => c.status === 'pendente' || c.status === 'sem_resposta').length;
  const monthSales = quotes.filter(q => q.status === 'aprovado').reduce((sum, q) => sum + q.value, 0);
  const overdueTasks = tasks.filter(t => isOverdue(t.due_date) && t.status !== 'concluida' && t.status !== 'cancelada').length;

  const todayTasks = tasks.filter(t => {
    const d = new Date(t.due_date);
    return d.toDateString() === todayStr && t.status !== 'concluida' && t.status !== 'cancelada';
  });
  const todayVisits = visits.filter(v => new Date(v.visit_date).toDateString() === todayStr);

  const funnelData = FUNNEL_STAGES.map(s => ({
    ...s,
    count: customers.filter(c => c.funnel_stage === s.id).length,
  }));

  const recentAlerts = customers
    .filter(c => isOverdue(c.next_action_date) && c.status === 'ativo')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-ks-gray-dark">Bom dia, Ricardo! 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Clientes Ativos" value={activeCustomers} icon={Users} color="green" onClick={() => navigate('/clientes')} />
        <StatCard label="Oportunidades" value={openOpportunities} icon={TrendingUp} color="blue" onClick={() => navigate('/funil')} />
        <StatCard label="Retornos Atrasados" value={overdueActions} icon={AlertTriangle} color="red" />
        <StatCard label="Vendas do Mês" value={formatCurrency(monthSales)} icon={DollarSign} color="orange" onClick={() => navigate('/orcamentos')} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="WhatsApp Pendente" value={pendingConversations} icon={MessageSquare} color="orange" onClick={() => navigate('/whatsapp')} />
        <StatCard label="Tarefas Atrasadas" value={overdueTasks} icon={CheckSquare} color="red" onClick={() => navigate('/tarefas')} />
        <StatCard label="Tarefas Hoje" value={todayTasks.length} icon={Clock} color="blue" onClick={() => navigate('/tarefas')} />
        <StatCard label="Visitas Hoje" value={todayVisits.length} icon={MapPin} color="green" onClick={() => navigate('/visitas')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funil visual */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-ks-green" />
            Funil Comercial
          </h2>
          <div className="space-y-2">
            {funnelData.map(stage => {
              const pct = activeCustomers > 0 ? (stage.count / activeCustomers) * 100 : 0;
              return (
                <div key={stage.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/funil')}>
                  <div className="w-32 text-xs text-gray-500 truncate">{stage.label}</div>
                  <div className="flex-1 bg-ks-gray-light rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 flex items-center pl-2"
                      style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: stage.color }}
                    >
                      {stage.count > 0 && <span className="text-white text-xs font-semibold">{stage.count}</span>}
                    </div>
                  </div>
                  <div className="w-6 text-xs text-gray-400 text-right">{stage.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-ks-danger" />
            Retornos Atrasados
          </h2>
          {recentAlerts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum retorno atrasado! 🎉</p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map(c => (
                <div
                  key={c.id}
                  className="p-3 bg-ks-danger-light rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => navigate(`/clientes/${c.id}`)}
                >
                  <div className="font-medium text-sm text-ks-gray-dark truncate">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.city} · {c.responsible?.name}</div>
                  <div className="text-xs text-ks-danger font-medium mt-1">
                    ⚠️ {c.next_action} — {formatDate(c.next_action_date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agenda do dia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <CheckSquare size={16} className="text-ks-green" />
            Tarefas de Hoje
          </h2>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Sem tarefas para hoje.</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.map(t => (
                <div key={t.id} className="flex items-start gap-3 p-3 bg-ks-gray-light rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${t.priority === 'alta' ? 'bg-ks-danger' : t.priority === 'media' ? 'bg-ks-orange' : 'bg-ks-green'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ks-gray-dark truncate">{t.title}</div>
                    <div className="text-xs text-gray-400">{t.customer?.name} · {t.responsible?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-ks-orange" />
            WhatsApp — Sem Resposta
          </h2>
          {conversations.filter(c => c.status === 'sem_resposta').length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Todas as conversas respondidas! ✅</p>
          ) : (
            <div className="space-y-2">
              {conversations.filter(c => c.status === 'sem_resposta').map(conv => (
                <div
                  key={conv.id}
                  className="flex items-start gap-3 p-3 bg-ks-orange-light rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => navigate('/whatsapp')}
                >
                  <div className="w-8 h-8 rounded-full bg-ks-orange flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {conv.customer?.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ks-gray-dark">{conv.customer?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{conv.last_message}</div>
                    <div className="text-xs text-ks-orange font-medium mt-0.5">
                      <Phone size={10} className="inline mr-1" />
                      {timeAgo(conv.last_interaction_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
