import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FUNNEL_STAGES } from '../lib/constants';
import { formatDate, isOverdue } from '../lib/utils';
import type { Customer, FunnelStage } from '../types';

export function Funnel() {
  const { customers, updateCustomer } = useApp();
  const navigate = useNavigate();
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const byStage = (stage: FunnelStage) => customers.filter(c => c.funnel_stage === stage);

  function handleDragStart(e: React.DragEvent, customerId: string) {
    setDragging(customerId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e: React.DragEvent, stage: FunnelStage) {
    e.preventDefault();
    if (dragging) {
      updateCustomer(dragging, { funnel_stage: stage });
    }
    setDragging(null);
    setDragOver(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Funil de Vendas</h1>
        <span className="text-sm text-gray-500">{customers.length} clientes</span>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {FUNNEL_STAGES.map(stage => {
            const items = byStage(stage.id);
            const isDragOver = dragOver === stage.id;
            return (
              <div
                key={stage.id}
                className={`w-64 flex-shrink-0 rounded-card transition-colors ${isDragOver ? 'bg-ks-green-light ring-2 ring-ks-green' : 'bg-ks-gray-light'}`}
                onDragOver={e => { e.preventDefault(); setDragOver(stage.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, stage.id)}
              >
                {/* Column header */}
                <div className="p-3 rounded-t-card" style={{ borderTop: `3px solid ${stage.color}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ks-gray-dark">{stage.label}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: stage.color }}
                    >
                      {items.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-32">
                  {items.map(c => (
                    <FunnelCard
                      key={c.id}
                      customer={c}
                      onDragStart={e => handleDragStart(e, c.id)}
                      isDragging={dragging === c.id}
                      onView={() => navigate(`/clientes/${c.id}`)}
                    />
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400">
                      {isDragOver ? 'Soltar aqui' : 'Sem clientes'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FunnelCard({ customer: c, onDragStart, isDragging, onView }: {
  customer: Customer;
  onDragStart: (e: React.DragEvent) => void;
  isDragging: boolean;
  onView: () => void;
}) {
  const overdue = isOverdue(c.next_action_date);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`bg-white rounded-lg p-3 shadow-card cursor-grab active:cursor-grabbing transition-all hover:shadow-card-hover ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="font-medium text-sm text-ks-gray-dark leading-tight">{c.name}</div>
        <button
          className="p-1 rounded hover:bg-ks-gray-light text-gray-400 hover:text-ks-green flex-shrink-0"
          onClick={e => { e.stopPropagation(); onView(); }}
        >
          <Eye size={13} />
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-1">{c.city}</div>
      {c.responsible && (
        <div className="text-xs text-gray-400 mt-0.5">👤 {c.responsible.name}</div>
      )}
      <div className={`mt-2 text-xs px-2 py-1 rounded ${overdue ? 'bg-ks-danger-light text-ks-danger' : 'bg-ks-gray-light text-gray-500'} flex items-center gap-1`}>
        {overdue && <AlertTriangle size={10} />}
        <span className="truncate">{c.next_action}</span>
      </div>
      <div className={`text-xs mt-0.5 font-medium ${overdue ? 'text-ks-danger' : 'text-gray-400'}`}>
        📅 {formatDate(c.next_action_date)}
      </div>
    </div>
  );
}
