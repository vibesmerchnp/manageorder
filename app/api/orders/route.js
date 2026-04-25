// GET /api/orders → { orders: [...] }
import { NextResponse } from 'next/server';
import { SAMPLE_ORDERS } from '@/lib/sample-data';

const useSample = () => process.env.USE_SAMPLE_DATA === 'true' || !process.env.GOOGLE_SHEET_ID;

export async function GET() {
  if (useSample()) {
    return NextResponse.json({ orders: SAMPLE_ORDERS, source: 'sample' });
  }
  try {
    const { fetchOrders } = await import('@/lib/google-sheets');
    const orders = await fetchOrders();
    return NextResponse.json({ orders, source: 'sheets' });
  } catch (e) {
    console.error('orders fetch', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
