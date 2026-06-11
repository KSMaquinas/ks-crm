import { BarChart2, TrendingUp, Users, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FUNNEL_STAGES, INTERESTS, QUOTE_CATEGORIES } from '../lib/constants';
import { formatCurrency } from '../lib/utils';

export function Reports() {
  const { customers, tasks, quotes, visits, users } = useApp();

  const sellerStats = users.map(u => ({
    user: u,
    customers: customers.filter(c => c.responsible_user_id === u.id).length,
    tasks: tasks.filter(t => t.responsible_user_id === u.id).length,
    tasksDone: tasks.filter(t => t.responsible_user_id === u.id && t.status === 'concluida').length,
    quotes: quotes.filter(q => q.responsible_user_id === u.id).length,
    sales: quotes.filter(q => q.responsible_user_id === u.id && q.status === 'aprovado').reduce((s, q) => s + q.value, 0),
    visits: visits.filter(v => v.responsible_user_id === u.id).length,
  })).filter(s => s.user.role !== 'technical');

  const interestStats = INTERESTS.map(i => ({
    interest: i,
    count: customers.filter(c => c.interests.includes(i.id)).length,
  })).sort((a, b) => b.count - a.count);

  const categoryStats = QUOTE_CATEGORIES.map(c => ({
    category: c,
    total: quotes.filter(q => q.category === c.id).reduce((s, q) => s + q.value, 0),
    count: quotes.filter(q => q.category === c.id).length,
    approved: quotes.filter(q => q.category === c.id && q.status === 'aprovado').reduce((s, q) => s + q.value, 0),
  })).filter(c => c.count > 0);

  const funnelStats = FUNNEL_STAGES.map(s => ({
    stage: s,
    count: customers.filter(c => c.funnel_stage === s.id).length,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-ks-gray-dark">Relatórios</h1>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Clientes', value: customers.length, icon: Users, color: 'text-ks-green' },
          { label: 'Orçamentos Enviados', value: quotes.length, icon: FileText, color: 'text-ks-orange' },
          { label: 'Vendas Realizadas', value: formatCurrency(quotes.filter(q => q.status === 'aprovado').reduce((s, q) => s + q.value, 0)), icon: TrendingUp, color: 'text-ks-green' },
          { label: 'Visitas Técnicas', value: visits.length, icon: BarChart2, color: 'text-blue-600' },
        ].map(item => (
          <div key={item.label} className="card">
            <item.icon size={20} className={item.color} />
            <div className="text-xl font-bold text-ks-gray-dark mt-2">{item.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By seller */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <Users size={15} className="text-ks-green" /> Por Vendedor
          </h2>
          <div className="space-y-3">
            {sellerStats.map(s => (
              <div key={s.user.id} className="p-3 bg-ks-gray-light rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-ks-gray-dark">{s.user.name}</div>
                  <div className="text-sm font-bold text-ks-green">{formatCurrency(s.sales)}</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500">
                  <div className="text-center"><div className="font-semibold text-ks-gray-dark">{s.customers}</div>Clientes</div>
                  <div className="text-center"><div className="font-semibold text-ks-gray-dark">{s.tasks}</div>Tarefas</div>
                  <div className="text-center"><div className="font-semibold text-ks-gray-dark">{s.quotes}</div>Orçamentos</div>
                  <div className="text-center"><div className="font-semibold text-ks-gray-dark">{s.visits}</div>Visitas</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-ks-green" /> Funil de Vendas
          </h2>
          <div className="space-y-2">
            {funnelStats.map(s => {
              const pct = customers.length > 0 ? (s.count / customers.length) * 100 : 0;
              return (
                <div key={s.stage.id} className="flex items-center gap-3">
                  <div className="w-36 text-xs text-gray-500">{s.stage.label}</div>
                  <div className="flex-1 bg-ks-gray-light rounded-full h-5">
                    <div
                      className="h-5 rounded-full flex items-center px-2 text-white text-xs font-semibold"
                      style={{ width: `${Math.max(pct, 5)}%`, backgroundColor: s.stage.color }}
                    >
                      {s.count > 0 && s.count}
                    </div>
                  </div>
                  <div className="w-6 text-xs text-gray-400 text-right">{s.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By interest */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            🌱 Interesses dos Clientes
          </h2>
          <div className="space-y-2">
            {interestStats.map(i => (
              <div key={i.interest.id} className="flex items-center justify-between p-2 bg-ks-gray-light rounded-lg">
                <span className="text-sm">{i.interest.emoji} {i.interest.label}</span>
                <span className="font-semibold text-ks-gray-dark text-sm">{i.count} clientes</span>
              </div>
            ))}
            {interestStats.every(i => i.count === 0) && <p className="text-sm text-gray-400">Sem dados.</p>}
          </div>
        </div>

        {/* By category */}
        <div className="card">
          <h2 className="font-semibold text-ks-gray-dark mb-4 flex items-center gap-2">
            <FileText size={15} className="text-ks-orange" /> Orçamentos por Categoria
          </h2>
          <div className="space-y-2">
            {categoryStats.map(c => (
              <div key={c.category.id} className="p-3 bg-ks-gray-light rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.category.label}</span>
                  <span className="text-ks-green font-semibold">{formatCurrency(c.approved)}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{c.count} orçamentos · Total: {formatCurrency(c.total)}</div>
              </div>
            ))}
            {categoryStats.length === 0 && <p className="text-sm text-gray-400">Sem orçamentos.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
