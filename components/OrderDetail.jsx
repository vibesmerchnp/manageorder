'use client';
import { useState, useEffect } from 'react';
import { Edit3, Save, Shirt } from 'lucide-react';
import { C } from '@/lib/theme';
import { DesignAdder } from './DesignAdder';
import { DesignSlot } from './DesignSlot';

function DetailRow({ label, value, editing, onChange, placeholder, multiline, highlight }) {
  return (
    <div className="grid grid-cols-3 gap-2 items-start">
      <span className="text-xs uppercase tracking-wider pt-1" style={{ color: C.ink3 }}>
        {label}
      </span>
      {editing && onChange ? (
        multiline ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="col-span-2 px-2 py-1 rounded text-sm resize-none"
            style={{ border: `1px solid ${C.line}`, background: C.white, minHeight: 50, color: C.ink }}
          />
        ) : (
          <input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="col-span-2 px-2 py-1 rounded text-sm"
            style={{ border: `1px solid ${C.line}`, background: C.white, color: C.ink }}
          />
        )
      ) : (
        <span
          className="col-span-2 text-sm"
          style={{ color: highlight ? C.accent : C.ink, fontWeight: highlight ? 600 : 400 }}
        >
          {value || placeholder || '—'}
        </span>
      )}
    </div>
  );
}

function shirtBg(color) {
  const c = (color || '').toLowerCase();
  if (c.includes('white')) return { bg: '#F5F5F5', fg: C.ink, border: C.line };
  if (c.includes('green')) return { bg: '#264F33', fg: 'white' };
  if (c.includes('red')) return { bg: '#7E2C2C', fg: 'white' };
  return { bg: '#1A1614', fg: 'white' };
}

export function OrderDetail({ order, designs, onUpdate, onAddDesign, onUpdateDesign, onRemoveDesign }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(order);
  useEffect(() => { setDraft(order); }, [order.id]);

  const orderDesigns = designs[order.id] || [];

  const save = () => {
    // diff against original — only push changed keys
    const patch = {};
    for (const k of Object.keys(draft)) {
      if (draft[k] !== order[k]) patch[k] = draft[k];
    }
    if (Object.keys(patch).length) onUpdate(order.id, patch);
    setEditing(false);
  };

  return (
    <div className="border-t" style={{ background: C.cream, borderColor: C.line }}>
      <div className="px-6 py-5 grid lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.ink3 }}>
              Order details
            </h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="text-xs flex items-center gap-1" style={{ color: C.accent }}>
                <Edit3 size={12} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setDraft(order); setEditing(false); }} className="text-xs" style={{ color: C.ink3 }}>
                  Cancel
                </button>
                <button onClick={save} className="text-xs flex items-center gap-1" style={{ color: C.accent }}>
                  <Save size={12} /> Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <DetailRow label="Name" value={draft.name} editing={editing} onChange={(v) => setDraft({ ...draft, name: v })} />
            <DetailRow label="Phone" value={draft.phone} editing={editing} onChange={(v) => setDraft({ ...draft, phone: v })} />
            <DetailRow label="Address" value={draft.address} editing={editing} onChange={(v) => setDraft({ ...draft, address: v })} multiline />
            <DetailRow label="Branch" value={draft.branch} editing={editing} onChange={(v) => setDraft({ ...draft, branch: v })} />
            <DetailRow label="Mode" value={draft.deliveryType} editing={editing} onChange={(v) => setDraft({ ...draft, deliveryType: v })} />
            <DetailRow label="Deadline" value={draft.deadline} editing={editing} onChange={(v) => setDraft({ ...draft, deadline: v })} placeholder="—" />
            <DetailRow label="Pre-paid" value={`Rs. ${draft.prePay}`} />
            <DetailRow label="COD" value={draft.remCod ? `Rs. ${draft.remCod}` : 'PAID'} highlight />
          </div>
        </div>

        {/* Middle: items */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.ink3 }}>
            T-shirts ({order.items.length})
          </h3>
          <div className="space-y-2">
            {order.items.map((it, i) => {
              const sty = shirtBg(it.color);
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: C.white, border: `1px solid ${C.line}` }}
                >
                  <div
                    className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                    style={{ background: sty.bg, color: sty.fg, border: sty.border ? `1px solid ${sty.border}` : 'none' }}
                  >
                    <Shirt size={16} strokeWidth={1.6} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: C.ink }}>
                      {it.color} <span style={{ color: C.ink3 }}>·</span> {it.size}
                    </div>
                    {it.print && (
                      <div className="text-xs mt-0.5" style={{ color: C.ink2 }}>{it.print}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: designs */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.ink3 }}>
            Designs ({orderDesigns.length})
          </h3>
          <DesignAdder
            onAdd={(file, opts) => onAddDesign(order.id, file, opts)}
            items={order.items}
          />
          {orderDesigns.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {orderDesigns.map((d) => (
                <DesignSlot
                  key={d.id}
                  design={d}
                  onUpdate={(updated) => onUpdateDesign(order.id, d.id, updated)}
                  onRemove={() => onRemoveDesign(order.id, d.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
