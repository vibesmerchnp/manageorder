'use client';
import { C } from '@/lib/theme';

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12" style={{ color: C.ink2 }}>
      <div
        className="w-4 h-4 rounded-full border-2 animate-spin"
        style={{ borderColor: C.line, borderTopColor: C.accent }}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
