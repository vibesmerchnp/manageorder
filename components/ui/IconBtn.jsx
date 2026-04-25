'use client';
import { C } from '@/lib/theme';

const VARIANTS = {
  primary: { bg: C.ink, fg: C.cream, hover: C.accent },
  accent: { bg: C.accent, fg: C.cream, hover: C.accent2 },
  ghost: { bg: 'transparent', fg: C.ink, hover: C.cream2 },
  bordered: { bg: C.white, fg: C.ink, hover: C.cream2 },
};

export function IconBtn({ icon: Icon, label, onClick, variant = 'ghost', disabled, className = '' }) {
  const v = VARIANTS[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        background: v.bg,
        color: v.fg,
        border: variant === 'bordered' ? `1px solid ${C.line}` : 'none',
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = v.hover)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.background = v.bg)}
    >
      {Icon && <Icon size={15} strokeWidth={1.8} />}
      <span>{label}</span>
    </button>
  );
}
