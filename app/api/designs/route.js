// GET    /api/designs?orderId=X         list designs for one order
// POST   /api/designs (multipart)        upload one design (file + orderId + label + tshirtRef)
// PATCH  /api/designs?id=Y body: {label} update label
// DELETE /api/designs?id=Y               delete from drive
import { NextResponse } from 'next/server';

const useSample = () => process.env.USE_SAMPLE_DATA === 'true' || !process.env.GOOGLE_DRIVE_DESIGNS_FOLDER_ID;

// In-memory store for sample mode (resets on server restart — fine for dev)
const sampleStore = new Map(); // orderId → designs[]

export async function GET(req) {
  const orderId = req.nextUrl.searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  if (useSample()) {
    return NextResponse.json({ designs: sampleStore.get(orderId) || [] });
  }
  const { listDesigns } = await import('@/lib/google-drive');
  const designs = await listDesigns(orderId);
  return NextResponse.json({ designs });
}

export async function POST(req) {
  const fd = await req.formData();
  const file = fd.get('file');
  const orderId = fd.get('orderId');
  const label = fd.get('label') || '';
  const tshirtRef = fd.get('tshirtRef') || '';
  if (!file || !orderId) return NextResponse.json({ error: 'missing file/orderId' }, { status: 400 });

  if (useSample()) {
    // Echo back as data URL — no real upload
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buf.toString('base64')}`;
    const design = {
      id: 'd_' + Math.random().toString(36).slice(2, 9),
      label,
      tshirtRef,
      url: dataUrl,
    };
    const arr = sampleStore.get(orderId) || [];
    arr.push(design);
    sampleStore.set(orderId, arr);
    return NextResponse.json({ design });
  }

  const { uploadDesign } = await import('@/lib/google-drive');
  const buffer = Buffer.from(await file.arrayBuffer());
  const design = await uploadDesign(orderId, label, tshirtRef, buffer, file.type);
  return NextResponse.json({ design });
}

export async function PATCH(req) {
  const id = req.nextUrl.searchParams.get('id');
  const patch = await req.json();
  if (useSample()) {
    for (const [orderId, arr] of sampleStore.entries()) {
      const idx = arr.findIndex(d => d.id === id);
      if (idx >= 0) {
        arr[idx] = { ...arr[idx], ...patch };
        sampleStore.set(orderId, arr);
        return NextResponse.json({ ok: true });
      }
    }
    return NextResponse.json({ ok: true });
  }
  // Drive: update file properties
  const { google } = await import('googleapis');
  const raw = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials: raw,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  const drive = google.drive({ version: 'v3', auth });
  await drive.files.update({
    fileId: id,
    requestBody: { properties: patch },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get('id');
  if (useSample()) {
    for (const [orderId, arr] of sampleStore.entries()) {
      const next = arr.filter(d => d.id !== id);
      sampleStore.set(orderId, next);
    }
    return NextResponse.json({ ok: true });
  }
  const { deleteDesign } = await import('@/lib/google-drive');
  await deleteDesign(id);
  return NextResponse.json({ ok: true });
}
