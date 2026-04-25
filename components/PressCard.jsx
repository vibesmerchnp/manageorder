'use client';
import { Shirt } from 'lucide-react';
import { C, FONT } from '@/lib/theme';
import { StatusPill } from './StatusPill';

export function PressCard({ order, designs }) {
  return (
    <div
      className="rounded-xl p-5 print-press-card"
      style={{ background: C.white, border: `1px solid ${C.line}` }}
    >
      <div
        className="flex items-start justify-between mb-3 pb-3"
        style={{ borderBottom: `1px solid ${C.line2}` }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>
              #{1000 + order.sn}
            </span>
            <span style={{ color: C.ink2, fontSize: 14 }}>·</span>
            <span className="font-medium">{order.name}</span>
            {order.deadline && (
              <span
                className="text-xs px-2 py-0.5 rounded font-medium ml-2"
                style={{ background: C.warn + '22', color: C.warn }}
              >
                {order.deadline}
              </span>
            )}
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: C.ink2 }}>
            {order.waNumber || order.phone}
          </div>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {order.items.map((it, idx) => {
          const ref = `${it.color} ${it.size}`;
          const matched = (designs || []).filter(d => !d.tshirtRef || d.tshirtRef === ref);
          return (
            <div key={idx}>
              <div
                className="text-sm font-semibold mb-2 pb-1 flex items-center gap-2"
                style={{ borderBottom: `1px dashed ${C.line}` }}
              >
                <Shirt size={14} />
                <span>
                  {it.color} <span style={{ color: C.ink3 }}>·</span> {it.size}
                </span>
                {it.print && (
                  <span className="text-xs ml-auto" style={{ color: C.ink2 }}>
                    ({it.print})
                  </span>
                )}
              </div>
              {matched.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {matched.map((d) => (
                    <div key={d.id} className="rounded overflow-hidden" style={{ border: `1px solid ${C.line2}` }}>
                      <div style={{ background: C.cream2, aspectRatio: '1' }}>
                        <img
                          src={d.url || d.imageData}
                          alt={d.label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div
                        className="text-[11px] text-center py-1 font-medium"
                        style={{ background: C.cream, color: C.ink }}
                      >
                        {d.label || '— no label —'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-xs italic px-3 py-4 rounded text-center"
                  style={{ background: C.cream, color: C.ink3 }}
                >
                  No designs added yet
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
