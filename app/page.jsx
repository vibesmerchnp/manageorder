'use client';
import { useState, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useDesigns } from '@/hooks/useDesigns';
import { useSelection } from '@/hooks/useSelection';
import { StatsStrip } from '@/components/StatsStrip';
import { SearchBar } from '@/components/SearchBar';
import { OrdersTable } from '@/components/OrdersTable';
import { BulkActionBar } from '@/components/BulkActionBar';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';
import { C } from '@/lib/theme';

export default function OrdersPage() {
  const { orders, loading, error, updateOrder, updateStatus, bulkUpdateStatus } = useOrders();
  const designsHook = useDesigns();
  const selection = useSelection();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${o.name} ${o.phone} ${o.address} ${o.branch} sn${o.sn} ${1000 + o.sn}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2000); };

  const handleStatus = async (id, s) => {
    await updateStatus(id, s);
    flash(`Status → ${s}`);
  };

  const handleBulkStatus = async (ids, s) => {
    await bulkUpdateStatus(ids, s);
    flash(`${ids.length} → ${s}`);
    selection.clear();
  };

  const handleExportXlsx = async (ids) => {
    const params = new URLSearchParams();
    ids.forEach(id => params.append('id', id));
    const r = await fetch(`/api/export/delivery-xlsx?${params}`);
    if (!r.ok) { flash('Export failed'); return; }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_package_vendor_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    flash(`Exported ${ids.length} rows`);
  };

  if (loading) return <Spinner label="Loading orders…" />;
  if (error) return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-center" style={{ color: C.ink2 }}>
      <p className="font-medium mb-2">Could not load orders.</p>
      <p className="text-sm" style={{ color: C.ink3 }}>{error}</p>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 no-print">
      {toast && (
        <div className="fixed top-24 right-6 z-40">
          <Toast message={toast} />
        </div>
      )}
      <StatsStrip
        orders={orders}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      <SearchBar
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />
      <OrdersTable
        orders={filtered}
        selection={selection}
        designs={designsHook.designs}
        onUpdateOrder={updateOrder}
        onUpdateStatus={handleStatus}
        onAddDesign={designsHook.addDesign}
        onUpdateDesign={designsHook.updateDesign}
        onRemoveDesign={designsHook.removeDesign}
      />
      <BulkActionBar
        selectedIds={Array.from(selection.selected)}
        onBulkStatus={handleBulkStatus}
        onClear={selection.clear}
        onExportXlsx={handleExportXlsx}
      />
    </main>
  );
}
