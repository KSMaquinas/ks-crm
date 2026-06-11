import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch, MessageSquare, CheckSquare,
  Calendar, Wrench, FileText, Megaphone, BarChart2, UserCog, Settings, X, Menu, LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/funil', label: 'Funil', icon: GitBranch },
  { to: '/whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { to: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { to: '/agenda', label: 'Agenda', icon: Calendar },
  { to: '/visitas', label: 'Visitas Técnicas', icon: Wrench },
  { to: '/orcamentos', label: 'Orçamentos', icon: FileText },
  { to: '/campanhas', label: 'Campanhas', icon: Megaphone },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart2 },
  { to: '/usuarios', label: 'Usuários', icon: UserCog },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

function NavItem({ to, label, icon: Icon, onClose }: { to: string; label: string; icon: typeof LayoutDashboard; onClose?: () => void }) {
  const location = useLocation();
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-white/20 text-white'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { profile, signOut } = useAuth();
  const initials = profile?.name.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'KS';
  const rolePT: Record<string, string> = { admin: 'Administrador', manager: 'Gerente', seller: 'Vendedor', technical: 'Ass. Técnica' };

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-ks-green">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-ks-green text-lg">
            KS
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">KS Máquinas</div>
            <div className="text-white/60 text-xs">CRM Comercial</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClose={onClose} />
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-ks-orange flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{profile?.name ?? 'Usuário'}</div>
            <div className="text-white/50 text-xs">{rolePT[profile?.role ?? ''] ?? ''}</div>
          </div>
          <button onClick={signOut} title="Sair" className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-ks-green text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}
