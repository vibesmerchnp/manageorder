// Server-only. Reads/writes the order sheet via service account.
import { google } from 'googleapis';

// Map sheet column → object key. Adjust if your sheet header changes.
const COL = {
  'S.N.': 'sn',
  'Odr. Date': 'date',
  'Status': 'status',
  'Whats App No.': 'waNumber',
  'Instagram ID': 'instagramId',
  'Name': 'name',
  'Contact No.': 'phone',
  'Address': 'address',
  'location': 'location',
  'branch': 'branch',
  'Colour': 'colour',
  'Size': 'size',
  'PRINT': 'print',
  'Tee Cost': 'teeCost',
  'Delivery': 'delivery',
  'Pre Pay': 'prePay',
  'Rem COD': 'remCod',
  'Delivery Type': 'deliveryType',
  'Deadline?': 'deadline',
};

let _sheets = null;

function getClient() {
  if (_sheets) return _sheets;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const creds = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  _sheets = google.sheets({ version: 'v4', auth });
  return _sheets;
}

// Convert raw sheet row (multi-line cells for color/size/print) into items[] + flat fields.
function rowToOrder(headers, row, idx) {
  const obj = {};
  headers.forEach((h, i) => {
    const k = COL[h];
    if (k) obj[k] = row[i] ?? '';
  });
  // Multi-tshirt orders use newlines in Colour/Size/PRINT cells
  const colors = String(obj.colour || '').split('\n').map(s => s.trim()).filter(Boolean);
  const sizes = String(obj.size || '').split('\n').map(s => s.trim()).filter(Boolean);
  const prints = String(obj.print || '').split('\n').map(s => s.trim());
  const count = Math.max(colors.length, sizes.length, 1);
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      color: colors[i] || colors[0] || '',
      size: sizes[i] || sizes[0] || '',
      print: prints[i] || prints[0] || '',
    });
  }
  return {
    id: `ord_${obj.sn || idx}`,
    sn: Number(obj.sn) || idx,
    date: obj.date || '',
    status: obj.status || 'Pending',
    name: obj.name || '',
    phone: String(obj.phone || ''),
    waNumber: obj.waNumber || '',
    address: obj.address || '',
    location: obj.location || '',
    branch: obj.branch || '',
    items,
    teeCost: Number(obj.teeCost) || 0,
    delivery: Number(obj.delivery) || 0,
    prePay: Number(obj.prePay) || 0,
    remCod: Number(obj.remCod) || 0,
    deliveryType: obj.deliveryType || '',
    deadline: obj.deadline || '',
    _rowIndex: idx + 2, // sheet row (1-indexed, +1 for header)
  };
}

export async function fetchOrders() {
  const sheets = getClient();
  const tab = process.env.GOOGLE_SHEET_TAB || '24 april';
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tab}!A1:Z`,
  });
  const rows = res.data.values || [];
  if (rows.length === 0) return [];
  const [headers, ...data] = rows;
  return data
    .filter(r => r.some(c => c && String(c).trim()))
    .map((r, i) => rowToOrder(headers, r, i));
}

// Update one column for one order. e.g. updateField(order, 'Status', 'Packed')
export async function updateOrderField(rowIndex, columnHeader, value) {
  const sheets = getClient();
  const tab = process.env.GOOGLE_SHEET_TAB || '24 april';
  // Find header position
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tab}!1:1`,
  });
  const headers = headerRes.data.values?.[0] || [];
  const colIdx = headers.indexOf(columnHeader);
  if (colIdx === -1) throw new Error(`Column "${columnHeader}" not found`);
  const colLetter = numToCol(colIdx + 1);
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tab}!${colLetter}${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[value]] },
  });
}

function numToCol(n) {
  let s = '';
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
