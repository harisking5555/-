import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusTextProps {
  status: string;
}

export function StatusText({ status }: StatusTextProps) {
  const s = status.trim();

  if (
    s === 'فعال' ||
    s === 'ادا شدہ' ||
    s === 'منظور' ||
    s === 'حاضر' ||
    s === 'جواب جاری' ||
    s === 'ممتاز' ||
    s === 'جید جداً'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (s === 'باقی' || s === 'زیر غور' || s === 'رخصت') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (s === 'غیر فعال' || s === 'مسترد' || s === 'غیر حاضر') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
        <XCircle className="h-3.5 w-3.5 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
}
