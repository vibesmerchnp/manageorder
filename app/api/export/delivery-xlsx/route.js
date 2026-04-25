// GET /api/export/delivery-xlsx?id=X&id=Y → xlsx download
import { NextResponse } from 'next/server';
import { SAMPLE_ORDERS } from '@/lib/sample-data';
import { buildDeliveryXlsxBuffer } from '@/lib/xlsx-export';

const useSample = () => process.env.USE_SAMPLE_DATA === 'true' || !process.env.GOOGLE_SHEET_ID;

export async function GET(req) {
  const ids = req.nextUrl.searchParams.getAll('id');

  let allOrders;
  if (useSample()) {
    allOrders = SAMPLE_ORDERS;
  } else {
    const { fetchOrders } = await import('@/lib/google-sheets');
    allOrders = await fetchOrders();
  }

  const target = ids.length > 0
    ? allOrders.filter(o => ids.includes(o.id))
    : allOrders;

  if (target.length === 0) {
    return NextResponse.json({ error: 'no orders matched' }, { status: 400 });
  }

  const buf = buildDeliveryXlsxBuffer(target);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="import_package_vendor_${Date.now()}.xlsx"`,
    },
  });
}
