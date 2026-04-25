'use client';
import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { DESIGN_LABELS } from '@/lib/constants';
import { C } from '@/lib/theme';

export function DesignSlot({ design, onUpdate, onRemove }) {
  const [labelOpen, setLabelOpen] = useState(false);

  const setLabel = (l) => {
    if (l === 'Custom') {
      const cl = prompt('Custom label:', design.label);
      if (cl) onUpdate({ ...design, label: cl });
    } else {
      onUpdate({ ...design, label: l });
    }
    setLabelOpen(false);
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{ border: `1px solid ${C.line}`, background: C.white }}
    >
      <div className="aspect-square relative" style={{ background: C.cream2 }}>
        <img src={design.url || design.imageData} alt="" className="w-full h-full object-contain" />
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', color: 'white' }}
        >
          <X size={13} />
        </button>
      </div>
      <div className="p-2 relative">
        <button
          onClick={() => setLabelOpen(o => !o)}
          className="w-full flex items-center justify-between px-2 py-1 rounded text-xs font-medium"
          style={{ background: C.cream, color: C.ink }}
        >
          <span>{design.label || 'Set label'}</span>
          <ChevronDown size={12} />
        </button>
        {labelOpen && (
          <div
            className="absolute z-30 left-2 right-2 mt-1 rounded shadow-lg overflow-hidden"
            style={{ background: C.white, border: `1px solid ${C.line}` }}
          >
            {DESIGN_LABELS.map((l) => (
              <button
                key={l}
                onClick={() => setLabel(l)}
                className="w-full text-left px-3 py-1.5 text-xs"
                style={{ color: C.ink }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.cream)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {l}
              </button>
            ))}
          </div>
        )}
        {design.tshirtRef && (
          <div className="mt-1 text-[10px] text-center" style={{ color: C.ink3 }}>
            for: {design.tshirtRef}
          </div>
        )}
      </div>
    </div>
  );
}
