import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input className={cn('input', error && 'border-ks-danger', className)} {...props} />
      {error && <p className="text-xs text-ks-danger mt-1">{error}</p>}
    </div>
  );
}
