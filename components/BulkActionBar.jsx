'use client';
import { useRouter } from 'next/navigation';
import { Truck, Download, Tag } from 'lucide-react';
import { STATUSES } from '@/lib/constants';
import { C } from '@/lib/theme';
import { IconBtn } from './ui/IconBtn';

export function BulkActionBar({ selectedIds, onBulkStatus, onClear, onExportXlsx }) {
  const router = useRouter();
  if (selectedIds.length === 0) return null;

  const goShipping = () => {
    sessionStorage.setItem('vm:shipping_ids', JSON.stringify(selectedIds));
    router.push('/shipping');
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2 z-30 no-print"
      style={{ background: C.ink, color: C.cream }}
    >
      <span className="text-sm font-medium pr-2 border-r" style={{ borderColor: C.ink3 }}>
        {selectedIds.length} selected
      </span>
      <IconBtn icon={Truck} label="Shipping labels" variant="accent" onClick={goShipping} />
      <IconBtn icon={Download} label="Delivery .xlsx" variant="bordered" onClick={() => onExportXlsx(selectedIds)} />
      <div className="relative group">
        <IconBtn icon={Tag} label="Set status" variant="bordered" onClick={() => {}} />
        <div
          className="absolute bottom-full mb-2 left-0 rounded-lg shadow-lg overflow-hidden invisible group-hover:visible"
          style={{ background: C.white, border: `1px solid ${C.line}`, minWidth: 130 }}
        >
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onBulkStatus(selectedIds, s)}
              className="w-full text-left px-3 py-1.5 text-sm"
              style={{ color: C.ink }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              → {s}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onClear} className="px-2 py-1.5 rounded text-xs" style={{ color: C.ink3 }}>
        Clear
      </button>
    </div>
  );
}
