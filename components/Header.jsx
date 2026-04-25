'use client';
import { C, FONT } from '@/lib/theme';

export function Header() {
  return (
    <header
      className="no-print sticky top-0 z-20"
      style={{ background: C.cream, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center font-display font-bold"
            style={{ background: C.ink, color: C.cream }}
          >
            V
          </div>
          <div>
            <div
              className="font-display"
              style={{ fontSize: 22, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              VibesMerch
            </div>
            <div className="text-xs" style={{ color: C.ink3 }}>
              Order desk
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
