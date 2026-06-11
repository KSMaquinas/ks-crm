import { useState } from 'react';
import { Plus, UserCheck, UserX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { UserRole } from '../types';

const roleLabel: Record<UserRole, string> = {
  admin: 'Administrador', manager: 'Gerente', seller: 'Vendedor', technical: 'Assistência Técnica',
};
const roleVariant: Record<UserRole, 'green' | 'orange' | 'blue' | 'gray'> = {
  admin: 'green', manager: 'blue', seller: 'orange', technical: 'gray',
};

const emptyForm = { name: '', email: '', phone: '', position: '', role: 'seller' as UserRole, password: '' };

export function Users() {
  const { users, addUser, toggleActive, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Nome, e-mail e senha são obrigatórios.');
      return;
    }
    if (form.password.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres.');
      return;
    }
    setSaving(true);
    setError('');
    const { error: err } = await addUser(form);
    setSaving(false);
    if (err) { setError(err); return; }
    setShowForm(false);
    setForm({ ...emptyForm });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ks-gray-dark">Usuários</h1>
        {isAdmin && (
          <button className="btn-primary" onClick={() => { setShowForm(true); setError(''); }}>
            <Plus size={16} /> Novo Usuário
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={u.id} className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-ks-green flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-ks-gray-dark">{u.name}</span>
                <Badge variant={roleVariant[u.role]}>{roleLabel[u.role]}</Badge>
                {!u.is_active && <Badge variant="red">Inativo</Badge>}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{u.position}</div>
              <div className="text-xs text-gray-400 mt-0.5">{u.email}{u.phone ? ` · ${u.phone}` : ''}</div>
            </div>
            {isAdmin && u.id !== currentUser?.id && (
              <button
                title={u.is_active ? 'Desativar' : 'Ativar'}
                className="p-2 rounded-lg hover:bg-ks-gray-light transition-colors"
                onClick={() => toggleActive(u.id, !u.is_active)}
              >
                {u.is_active
                  ? <UserCheck size={18} className="text-ks-green" />
                  : <UserX size={18} className="text-ks-danger" />}
              </button>
            )}
            {(!isAdmin || u.id === currentUser?.id) && (
              <div>
                {u.is_active
                  ? <UserCheck size={18} className="text-ks-green" />
                  : <UserX size={18} className="text-ks-danger" />}
              </div>
            )}
          </div>
        ))}
        {users.length === 0 && (
          <div className="card text-center py-12 text-gray-400 lg:col-span-2">
            Nenhum usuário cadastrado.
          </div>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Novo Usuário" size="md">
        <div className="space-y-4">
          <Input
            label="Nome completo *"
            placeholder="Nome do usuário"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="E-mail *"
            type="email"
            placeholder="email@ksmaquinas.com.br"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Telefone"
            placeholder="(69) 9..."
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Cargo"
            placeholder="Vendedor, Técnico..."
            value={form.position}
            onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
          />
          <Select
            label="Perfil *"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'manager', label: 'Gerente' },
              { value: 'seller', label: 'Vendedor' },
              { value: 'technical', label: 'Assistência Técnica' },
            ]}
          />
          <Input
            label="Senha provisória *"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          {error && (
            <div className="bg-ks-danger-light text-ks-danger text-sm rounded-lg px-3 py-2">⚠️ {error}</div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-ks-gray-medium">
          <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Criando...' : <><Plus size={16} /> Criar Usuário</>}
          </button>
        </div>
      </Modal>
    </div>
  );
}
