// PATCH /api/orders/[id] body: { status?, deadline?, address?, ... }
import { NextResponse } from 'next/server';
import { SAMPLE_ORDERS } from '@/lib/sample-data';

// Map client field name → sheet column header
const FIELD_TO_COL = {
  status: 'Status',
  deadline: 'Deadline?',
  address: 'Address',
  name: 'Name',
  phone: 'Contact No.',
  branch: 'branch',
  deliveryType: 'Delivery Type',
  remCod: 'Rem COD',
  prePay: 'Pre Pay',
};

const useSample = () => process.env.USE_SAMPLE_DATA === 'true' || !process.env.GOOGLE_SHEET_ID;

export async function PATCH(req, { params }) {
  const { id } = params;
  const patch = await req.json();

  if (useSample()) {
    // No persistence in sample mode — frontend keeps optimistic state.
    return NextResponse.json({ ok: true, source: 'sample' });
  }

  try {
    const { fetchOrders, updateOrderField } = await import('@/lib/google-sheets');
    const orders = await fetchOrders();
    const target = orders.find(o => o.id === id);
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    for (const [field, value] of Object.entries(patch)) {
      const col = FIELD_TO_COL[field];
      if (col) await updateOrderField(target._rowIndex, col, value);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('order patch', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
