'use client';
import { useEffect, useState } from 'react';
import { Printer, Download } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { ShippingLabel } from '@/components/ShippingLabel';
import { IconBtn } from '@/components/ui/IconBtn';
import { Spinner } from '@/components/ui/Spinner';
import { C } from '@/lib/theme';

export default function ShippingPage() {
  const { orders, loading } = useOrders();
  const [shippingIds, setShippingIds] = useState(null);

  // Pull selection from session storage (set by BulkActionBar)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('vm:shipping_ids');
      if (raw) setShippingIds(JSON.parse(raw));
    } catch {}
  }, []);

  const target = shippingIds && shippingIds.length > 0
    ? orders.filter(o => shippingIds.includes(o.id))
    : orders;

  const print = () => window.print();

  const exportXlsx = async () => {
    const params = new URLSearchParams();
    target.forEach(o => params.append('id', o.id));
    const r = await fetch(`/api/export/delivery-xlsx?${params}`);
    if (!r.ok) return;
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_package_vendor_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Spinner label="Loading…" />;

  return (
    <main className="max-w-5xl mx-auto px-6 py-6">
      <div className="no-print mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.1 }}>
            Shipping labels
          </h2>
          <p className="text-sm mt-1" style={{ color: C.ink2 }}>
            {shippingIds && shippingIds.length > 0
              ? `Showing ${shippingIds.length} selected order${shippingIds.length > 1 ? 's' : ''}.`
              : 'Showing all orders. Tick orders on Orders tab to filter.'}
            {' '}Use Print / Save as PDF.
          </p>
        </div>
        <div className="flex gap-2">
          <IconBtn icon={Download} label="Delivery .xlsx" variant="bordered" onClick={exportXlsx} />
          <IconBtn icon={Printer} label="Print / Save PDF" variant="primary" onClick={print} />
        </div>
      </div>

      <div className="print-grid grid grid-cols-1 md:grid-cols-2 gap-3">
        {target.map(o => (
          <ShippingLabel key={o.id} order={o} />
        ))}
      </div>
    </main>
  );
}
