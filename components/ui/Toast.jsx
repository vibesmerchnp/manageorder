'use client';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { C } from '@/lib/theme';

export function Toast({ message, kind = 'ok' }) {
  if (!message) return null;
  const Icon = kind === 'ok' ? CheckCircle2 : AlertCircle;
  const color = kind === 'ok' ? C.ok : '#7E2C2C';
  return (
    <div
      className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
      style={{ background: color + '22', color }}
    >
      <Icon size={12} />
      {message}
    </div>
  );
}
