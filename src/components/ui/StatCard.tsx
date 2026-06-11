import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'green' | 'orange' | 'red' | 'blue';
  trend?: string;
  onClick?: () => void;
}

const colors = {
  green: { bg: 'bg-ks-green-light', icon: 'text-ks-green', border: 'border-l-ks-green' },
  orange: { bg: 'bg-ks-orange-light', icon: 'text-ks-orange', border: 'border-l-ks-orange' },
  red: { bg: 'bg-ks-danger-light', icon: 'text-ks-danger', border: 'border-l-ks-danger' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-l-blue-500' },
};

export function StatCard({ label, value, icon: Icon, color = 'green', trend, onClick }: StatCardProps) {
  const c = colors[color];
  return (
    <div
      className={cn('card border-l-4 cursor-pointer hover:shadow-card-hover transition-shadow', c.border, onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-ks-gray-dark mt-1">{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
        </div>
        <div className={cn('p-3 rounded-xl', c.bg)}>
          <Icon size={22} className={c.icon} />
        </div>
      </div>
    </div>
  );
}
