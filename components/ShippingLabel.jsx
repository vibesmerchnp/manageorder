'use client';
import { C, FONT } from '@/lib/theme';

export function ShippingLabel({ order }) {
  const isPaid = !order.remCod || order.remCod === 0;
  return (
    <div
      className="print-label rounded-lg p-4 relative"
      style={{ background: C.white, border: `1px solid ${C.line}`, minHeight: 200 }}
    >
      <div
        className="absolute top-3 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded font-display"
        style={{ background: C.ink, color: C.cream }}
      >
        V
      </div>
      <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>
        VibesMerch.np
      </div>
      <div className="mt-2 text-sm space-y-0.5">
        <div className="font-mono text-xs" style={{ color: C.ink2 }}>SN: {1000 + order.sn}</div>
        <div>Name: <span className="font-medium">{order.name}</span></div>
        <div>Number: <span className="font-mono">{order.phone}</span></div>
        <div className="leading-tight">Address: {order.address}</div>
        <div className="font-bold mt-1.5" style={{ color: isPaid ? C.ok : C.ink }}>
          {isPaid ? 'PAID' : `COD: Rs. ${order.remCod}`}
        </div>
        <div className="text-xs">Mode: {order.deliveryType}</div>
      </div>
      <div className="mt-3 pt-2" style={{ borderTop: `1px dashed ${C.line}` }}>
        {order.deadline ? (
          <div className="text-xs">
            <span
              className="inline-block px-2 py-0.5 rounded font-bold mr-2"
              style={{ background: C.ink, color: C.cream }}
            >
              Remarks: {order.deadline}
            </span>
            <span style={{ color: C.ink3 }}>_____________________</span>
          </div>
        ) : (
          <div className="text-xs" style={{ color: C.ink3 }}>
            Remarks: ________________________________________
          </div>
        )}
      </div>
    </div>
  );
}
