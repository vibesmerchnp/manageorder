'use client';
import { useState, useRef, useCallback } from 'react';
import { Clipboard, Upload } from 'lucide-react';
import { fileFromClipboard } from '@/lib/image';
import { C } from '@/lib/theme';

export function DesignAdder({ onAdd, items }) {
  const fileRef = useRef(null);
  const [tshirtRef, setTshirtRef] = useState(items?.[0] ? `${items[0].color} ${items[0].size}` : '');
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file?.type?.startsWith('image/')) return;
    setBusy(true);
    try {
      await onAdd(file, { tshirtRef });
    } finally {
      setBusy(false);
    }
  }, [onAdd, tshirtRef]);

  const onPaste = useCallback(async (e) => {
    const file = fileFromClipboard(e);
    if (file) {
      e.preventDefault();
      await handleFile(file);
    }
  }, [handleFile]);

  const onChange = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) await handleFile(f);
    e.target.value = '';
  }, [handleFile]);

  return (
    <div
      className="rounded-lg p-3"
      style={{ background: C.cream, border: `1px dashed ${C.line}` }}
      onPaste={onPaste}
      tabIndex={0}
    >
      <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: C.ink2 }}>
        <Clipboard size={12} />
        Paste image (Cmd/Ctrl+V) or upload — label after
      </div>
      <div className="flex gap-2 items-stretch">
        {items && items.length > 1 && (
          <select
            value={tshirtRef}
            onChange={(e) => setTshirtRef(e.target.value)}
            className="px-2 py-1.5 text-xs rounded"
            style={{ border: `1px solid ${C.line}`, background: C.white, color: C.ink }}
          >
            {items.map((it, i) => (
              <option key={i} value={`${it.color} ${it.size}`}>
                {it.color} {it.size}
              </option>
            ))}
          </select>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onChange}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex-1 px-3 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-60"
          style={{ background: C.white, color: C.ink, border: `1px solid ${C.line}` }}
        >
          <Upload size={12} />
          {busy ? 'Uploading…' : 'Upload image'}
        </button>
      </div>
    </div>
  );
}
