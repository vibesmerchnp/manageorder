'use client';
import { STATUSES, STATUS_STYLE } from '@/lib/constants';
import { C } from '@/lib/theme';

export function StatusMenu({ current, onSelect, onClose }) {
  return (
    <div
      className="absolute z-30 mt-1 rounded-lg shadow-lg overflow-hidden"
      style={{ background: C.white, border: `1px solid ${C.line}`, minWidth: 140 }}
      onMouseLeave={onClose}
    >
      {STATUSES.map((s) => {
        const st = STATUS_STYLE[s];
        const active = current === s;
        return (
          <button
            key={s}
            onClick={() => { onSelect(s); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm transition text-left"
            style={{
              background: active ? C.cream : 'transparent',
              color: C.ink,
              fontWeight: active ? 600 : 400,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.cream)}
            onMouseLeave={(e) => (e.currentTarget.style.background = active ? C.cream : 'transparent')}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: st.d }} />
            {s}
          </button>
        );
      })}
    </div>
  );
}
