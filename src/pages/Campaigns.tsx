import { useState } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/utils';

export function Campaigns() {
  const { campaigns } = useApp();
  const [showForm, setShowForm] = useState(false);

  const statusVariant = { ativa: 'green' as const, inativa: 'gray' as const, encerrada: 'red' as const };
  const statusLabel = { ativa: 'Ativa', inativa: 'Inativa', encerrada: 'Encerrada' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Campanhas</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Nova Campanha</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="card hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 bg-ks-green-light rounded-xl flex items-center justify-center">
                <Megaphone size={18} className="text-ks-green" />
              </div>
              <Badge variant={statusVariant[c.status]}>{statusLabel[c.status]}</Badge>
            </div>
            <h3 className="font-semibold text-ks-gray-dark">{c.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{c.description}</p>
            <div className="mt-3 pt-3 border-t border-ks-gray-medium text-xs text-gray-400 flex gap-3">
              <span>📅 Início: {formatDate(c.start_date)}</span>
              <span>📅 Fim: {formatDate(c.end_date)}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nova Campanha" size="md">
        <div className="space-y-4">
          <Input label="Nome da Campanha *" placeholder="Ex: Sementes Acácia" />
          <Textarea label="Descrição" placeholder="Descreva os objetivos da campanha" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data de Início" type="date" />
            <Input label="Data de Fim" type="date" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary"><Plus size={16} /> Criar Campanha</button>
        </div>
      </Modal>
    </div>
  );
}
