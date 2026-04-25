# VibesMerch Desk

Web order desk for VibesMerch.np. Replaces the Python scripts (`create_labels.py`, `packrs_import.py`) and the manually-maintained press-reference PDF.

## Architecture

```
app/                       # Next.js App Router (pages + API)
  layout.jsx               # root shell (header + tabs)
  globals.css              # tailwind + print rules
  page.jsx                 # /        Orders dashboard
  press/page.jsx           # /press   Press reference (replaces 24_April.pdf)
  shipping/page.jsx        # /shipping Shipping labels (replaces create_labels.py)
  api/orders/route.js      # GET orders from sheet
  api/orders/[id]/route.js # PATCH single order back to sheet
  api/designs/route.js     # GET/POST/PATCH/DELETE design images on Drive
  api/export/delivery-xlsx/route.js  # downloads .xlsx (replaces packrs_import.py)

components/                # UI building blocks (one job each)
  Header.jsx               # brand bar
  Tabs.jsx                 # nav between pages
  StatsStrip.jsx           # counters per status, click to filter
  SearchBar.jsx            # search + filter chip
  OrdersTable.jsx          # row list w/ checkboxes + expand
  OrderRow                 # (inside OrdersTable) one table row
  OrderDetail.jsx          # expand panel: edit + designs
  StatusPill.jsx           # status badge
  StatusMenu.jsx           # status dropdown
  DesignAdder.jsx          # paste/upload image w/ tshirt selector
  DesignSlot.jsx           # one design tile w/ label dropdown
  ShippingLabel.jsx        # one printable label tile
  PressCard.jsx            # one press-reference card
  BulkActionBar.jsx        # bottom toolbar when N selected
  ui/IconBtn.jsx           # button atom
  ui/Toast.jsx             # flash message
  ui/Spinner.jsx           # loader

lib/                       # pure helpers (no React)
  constants.js             # statuses, design labels, sender info
  theme.js                 # color tokens, font stacks
  image.js                 # compress + clipboard paste helper
  sample-data.js           # 8 real orders for dev mode
  google-sheets.js         # Sheets API adapter (server-only)
  google-drive.js          # Drive API adapter (server-only)
  xlsx-export.js           # delivery .xlsx builder

hooks/                     # client state
  useOrders.js             # fetch + optimistic update
  useDesigns.js            # per-order designs, upload via /api/designs
  useSelection.js          # checkbox set
```

## Data flow

```
Google Sheet ──fetchOrders()──> /api/orders ──> useOrders() ──> <OrdersTable>
                                                       └──PATCH──> /api/orders/[id] ──> updateOrderField()

clipboard paste ──compressImage──> useDesigns().addDesign
                                          └──POST multipart──> /api/designs ──> uploadDesign() (Drive)

selection ──> /api/export/delivery-xlsx ──> buildDeliveryXlsxBuffer() ──> .xlsx download

selection ──sessionStorage──> /shipping ──> window.print() ──> PDF
queue (Designed/Printed) ──> /press ──> window.print() ──> PDF
```

## Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local — keep USE_SAMPLE_DATA=true for first run
npm run dev
```

Open http://localhost:3000.

## Connecting to your Google Sheet

1. Go to https://console.cloud.google.com → create a project (or use existing).
2. Enable APIs: Google Sheets API + Google Drive API.
3. IAM → Service Accounts → Create. Download JSON key.
4. Open your order sheet → Share → paste the service account email (looks like `xxx@yyy.iam.gserviceaccount.com`) → Editor.
5. Create a Drive folder for designs → Share with the same service account email → Editor. Copy folder ID from URL.
6. In `.env.local`:
   - `GOOGLE_SERVICE_ACCOUNT_JSON` = paste the entire JSON file contents (one line)
   - `GOOGLE_SHEET_ID` = ID from sheet URL
   - `GOOGLE_SHEET_TAB` = tab name (e.g. `24 april`)
   - `GOOGLE_DRIVE_DESIGNS_FOLDER_ID` = folder ID
   - `USE_SAMPLE_DATA=false`
7. Restart `npm run dev`.

## Sheet column expectations

`lib/google-sheets.js` reads these column headers (must match your sheet):

`S.N. | Odr. Date | Status | Whats App No. | Instagram ID | Name | Contact No. | Address | location | branch | Colour | Size | PRINT | Tee Cost | Delivery | Pre Pay | Rem COD | Delivery Type | Deadline?`

Multi-tshirt orders use `\n` (Alt+Enter) inside `Colour` / `Size` / `PRINT` cells.

To map differently, edit the `COL` map at the top of `lib/google-sheets.js`.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add the same `.env.local` vars in the Vercel project settings.

## Replaces

- `create_labels.py` → `/shipping` page → Print to PDF
- `packrs_import.py` → `/api/export/delivery-xlsx` → button on Orders page
- `24_April.pdf` (manual) → `/press` page → Print to PDF, designs auto-attached

## Notes

- Sample mode (`USE_SAMPLE_DATA=true`) needs no Google credentials. Designs persist in server memory only — restart wipes them. Use real Drive for persistence.
- All print outputs use browser print dialog. Choose "Save as PDF" + A4 + remove headers/footers in print options.
- Status changes write back to the sheet immediately (optimistic UI, rollback on failure).
