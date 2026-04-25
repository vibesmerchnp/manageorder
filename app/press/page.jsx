'use client';
import { useEffect, useMemo, useState } from 'react';
import { Printer } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useDesigns } from '@/hooks/useDesigns';
import { PressCard } from '@/components/PressCard';
import { IconBtn } from '@/components/ui/IconBtn';
import { Spinner } from '@/components/ui/Spinner';
import { PRESS_STATUSES } from '@/lib/constants';
import { C } from '@/lib/theme';

export default function PressPage() {
  const { orders, loading } = useOrders();
  const { designs, loadFor } = useDesigns();

  const queue = useMemo(
    () => orders.filter(o => PRESS_STATUSES.includes(o.status)),
    [orders]
  );

  // Lazy-load designs for orders in queue
  useEffect(() => {
    queue.forEach(o => loadFor(o.id));
  }, [queue, loadFor]);

  const print = () => setTimeout(() => window.print(), 200);

  if (loading) return <Spinner label="Loading press queue…" />;

  return (
    <main className="max-w-5xl mx-auto px-6 py-6">
      <div className="no-print mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.1 }}>
            Press reference
          </h2>
          <p className="text-sm mt-1" style={{ color: C.ink2 }}>
            Auto-built from orders &amp; pasted designs. Print to PDF for the press table.
          </p>
        </div>
        <IconBtn icon={Printer} label="Print / Save PDF" variant="primary" onClick={print} />
      </div>

      <div className="print-only" style={{ marginBottom: 16 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Press sheet — VibesMerch.np
        </h1>
        <p style={{ fontSize: 11, color: C.ink2 }}>
          {new Date().toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {queue.map(o => (
          <PressCard key={o.id} order={o} designs={designs[o.id] || []} />
        ))}
        {queue.length === 0 && (
          <div className="text-center py-12" style={{ color: C.ink3 }}>
            No orders awaiting press.
          </div>
        )}
      </div>
    </main>
  );
}
