'use client';
import { STATUS_STYLE } from '@/lib/constants';

export function StatusPill({ status, onClick, size = 'sm' }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const text = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border ${padding} ${text} font-medium transition`}
      style={{ background: s.bg, color: s.fg, borderColor: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.d }} />
      {status}
    </button>
  );
}
