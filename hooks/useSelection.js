'use client';
import { useState, useCallback } from 'react';

// Set-based selection for tickbox tables.
export function useSelection() {
  const [selected, setSelected] = useState(new Set());

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const setAll = useCallback((ids) => setSelected(new Set(ids)), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  const has = useCallback((id) => selected.has(id), [selected]);

  return { selected, toggle, setAll, clear, has, size: selected.size };
}
