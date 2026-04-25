// Server-only. Stores design images in Drive folder, structured per order.
import { google } from 'googleapis';
import { Readable } from 'stream';

let _drive = null;

function getClient() {
  if (_drive) return _drive;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const creds = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  _drive = google.drive({ version: 'v3', auth });
  return _drive;
}

const ROOT = () => process.env.GOOGLE_DRIVE_DESIGNS_FOLDER_ID;

// Find or create a subfolder by name under parent
async function ensureFolder(name, parent) {
  const drive = getClient();
  const q = `mimeType='application/vnd.google-apps.folder' and name='${name.replace(/'/g, "\\'")}' and '${parent}' in parents and trashed=false`;
  const res = await drive.files.list({ q, fields: 'files(id, name)' });
  if (res.data.files && res.data.files.length > 0) return res.data.files[0].id;
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parent],
    },
    fields: 'id',
  });
  return created.data.id;
}

// Upload a design image. Returns { id, label, url, tshirtRef }
export async function uploadDesign(orderId, label, tshirtRef, buffer, mimeType) {
  const drive = getClient();
  const orderFolder = await ensureFolder(orderId, ROOT());
  const safeLabel = (label || 'unlabeled').replace(/[^a-z0-9_-]/gi, '_');
  const name = `${Date.now()}_${safeLabel}.jpg`;
  const stream = Readable.from(buffer);
  const file = await drive.files.create({
    requestBody: {
      name,
      parents: [orderFolder],
      properties: { label, tshirtRef: tshirtRef || '' },
    },
    media: { mimeType, body: stream },
    fields: 'id, name, properties, webContentLink, thumbnailLink',
  });
  // Make readable to anyone with link (so <img> tags work)
  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });
  return {
    id: file.data.id,
    label,
    tshirtRef: tshirtRef || '',
    url: `https://drive.google.com/uc?id=${file.data.id}`,
  };
}

export async function listDesigns(orderId) {
  const drive = getClient();
  const orderFolder = await ensureFolder(orderId, ROOT());
  const res = await drive.files.list({
    q: `'${orderFolder}' in parents and trashed=false`,
    fields: 'files(id, name, properties)',
  });
  return (res.data.files || []).map(f => ({
    id: f.id,
    label: f.properties?.label || '',
    tshirtRef: f.properties?.tshirtRef || '',
    url: `https://drive.google.com/uc?id=${f.id}`,
  }));
}

export async function deleteDesign(fileId) {
  const drive = getClient();
  await drive.files.delete({ fileId });
}
