'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Palette, Truck } from 'lucide-react';
import { C } from '@/lib/theme';

const TABS = [
  { href: '/', label: 'Orders', icon: Package },
  { href: '/press', label: 'Press mode', icon: Palette },
  { href: '/shipping', label: 'Shipping labels', icon: Truck },
];

export function Tabs() {
  const pathname = usePathname();
  return (
    <nav
      className="no-print sticky top-[73px] z-10"
      style={{ background: C.cream, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition relative"
              style={{ color: active ? C.ink : C.ink3 }}
            >
              <t.icon size={14} strokeWidth={1.8} />
              {t.label}
              {active && (
                <div
                  className="absolute bottom-0 left-3 right-3 h-0.5"
                  style={{ background: C.accent }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
