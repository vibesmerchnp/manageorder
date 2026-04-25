'use client';
import { useState, useEffect, useCallback } from 'react';

// Fetches orders from /api/orders. Updates push back to sheet via PATCH.
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/orders');
      if (!r.ok) throw new Error('Failed to load orders');
      const data = await r.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // Optimistic update + PATCH
  const updateOrder = useCallback(async (id, patch) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
    try {
      const r = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!r.ok) throw new Error('Save failed');
    } catch (e) {
      // Roll back on failure
      reload();
      throw e;
    }
  }, [reload]);

  const updateStatus = useCallback((id, status) => updateOrder(id, { status }), [updateOrder]);

  const bulkUpdateStatus = useCallback(async (ids, status) => {
    await Promise.all(ids.map(id => updateOrder(id, { status })));
  }, [updateOrder]);

  return { orders, loading, error, reload, updateOrder, updateStatus, bulkUpdateStatus };
}
