import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  delta,
  deltaTone = 'neutral',
  icon: Icon,
  onClick,
}: StatCardProps) {
  const toneClass =
    deltaTone === 'positive'
      ? 'text-emerald-700'
      : deltaTone === 'negative'
      ? 'text-red-600'
      : 'text-slate-500';

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 font-mono-num text-2xl font-semibold tracking-tight text-[#0F294A]">
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[#2563EB]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {delta && (
        <p className={`mt-2.5 text-xs font-medium tabular-nums ${toneClass}`}>
          {delta}
        </p>
      )}
    </Wrapper>
  );
}
