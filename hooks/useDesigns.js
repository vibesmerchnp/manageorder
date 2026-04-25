'use client';
import { useState, useEffect, useCallback } from 'react';
import { compressImage, dataUrlToBlob } from '@/lib/image';

// Manages design images per order. Persists to Drive via /api/designs.
export function useDesigns(orderIds = []) {
  const [designs, setDesigns] = useState({}); // { orderId: [{id, url, label, tshirtRef}] }
  const [loading, setLoading] = useState(false);

  // Lazy-load designs for one order on demand
  const loadFor = useCallback(async (orderId) => {
    if (designs[orderId]) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/designs?orderId=${encodeURIComponent(orderId)}`);
      if (r.ok) {
        const data = await r.json();
        setDesigns(prev => ({ ...prev, [orderId]: data.designs || [] }));
      }
    } finally {
      setLoading(false);
    }
  }, [designs]);

  // Upload from File or paste
  const addDesign = useCallback(async (orderId, file, { label = '', tshirtRef = '' } = {}) => {
    const dataUrl = await compressImage(file);
    const blob = dataUrlToBlob(dataUrl);
    const fd = new FormData();
    fd.append('file', blob, 'design.jpg');
    fd.append('orderId', orderId);
    fd.append('label', label);
    fd.append('tshirtRef', tshirtRef);
    const r = await fetch('/api/designs', { method: 'POST', body: fd });
    if (!r.ok) throw new Error('Upload failed');
    const { design } = await r.json();
    setDesigns(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), design],
    }));
    return design;
  }, []);

  const updateDesign = useCallback(async (orderId, designId, patch) => {
    setDesigns(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || []).map(d => (d.id === designId ? { ...d, ...patch } : d)),
    }));
    await fetch(`/api/designs?id=${designId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  }, []);

  const removeDesign = useCallback(async (orderId, designId) => {
    setDesigns(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || []).filter(d => d.id !== designId),
    }));
    await fetch(`/api/designs?id=${designId}`, { method: 'DELETE' });
  }, []);

  return { designs, loadFor, addDesign, updateDesign, removeDesign, loading };
}
