import { cn } from '../../lib/utils';

type Variant = 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'purple' | 'yellow';

const variants: Record<Variant, string> = {
  green: 'bg-ks-green-light text-ks-green',
  orange: 'bg-ks-orange-light text-ks-orange-dark',
  red: 'bg-ks-danger-light text-ks-danger',
  gray: 'bg-ks-gray-light text-ks-gray-dark',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  yellow: 'bg-yellow-50 text-yellow-700',
};

export function Badge({ children, variant = 'gray', className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
