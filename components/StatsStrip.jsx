'use client';
import { useMemo } from 'react';
import { STATUSES } from '@/lib/constants';
import { C, FONT } from '@/lib/theme';

export function StatsStrip({ orders, statusFilter, onFilterChange }) {
  const stats = useMemo(() => {
    const s = { total: orders.length };
    STATUSES.forEach(st => (s[st] = 0));
    orders.forEach(o => (s[o.status] = (s[o.status] || 0) + 1));
    return s;
  }, [orders]);

  const cards = [
    { label: 'Total', value: stats.total, key: null },
    ...STATUSES.map(st => ({ label: st, value: stats[st], key: st })),
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-5">
      {cards.map((card) => {
        const active = card.key && statusFilter === card.key;
        return (
          <button
            key={card.label}
            onClick={() => card.key && onFilterChange(active ? 'All' : card.key)}
            className="rounded-lg p-3 text-left transition"
            style={{
              background: active ? C.ink : C.white,
              color: active ? C.cream : C.ink,
              border: `1px solid ${C.line}`,
              cursor: card.key ? 'pointer' : 'default',
            }}
          >
            <div
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: active ? C.cream2 : C.ink3 }}
            >
              {card.label}
            </div>
            <div
              className="font-display"
              style={{ fontSize: 24, fontWeight: 600, lineHeight: 1 }}
            >
              {card.value}
            </div>
          </button>
        );
      })}
    </div>
  );
}
