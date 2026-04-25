// Build the import_package_vendor.xlsx that the delivery company expects.
// Mirrors logic from packrs_import.py.
import * as XLSX from 'xlsx';
import {
  SENDER_LOCATION,
  DEFAULT_FRAGILE,
  DEFAULT_WEIGHT_KG,
} from './constants.js';

export function ordersToDeliveryRows(orders) {
  return orders.map(o => {
    const loc = String(o.location || '').toLowerCase().trim();
    const package_type =
      loc === 'inside' ? 'inside valley' :
      loc === 'outside' ? 'outside valley' : '';
    const delivery_type = loc === 'inside' ? 'Normal Home Delivery' : (o.deliveryType || '');
    const remarks = (o.deadline || '').trim();
    return {
      's.n': o.sn,
      package_type,
      from: SENDER_LOCATION,
      to: o.branch || '',
      delivery_type,
      customer_name: o.name,
      customer_phone: o.phone,
      customer_address: o.address,
      remarks,
      amount: o.remCod || 0,
      is_fragile: DEFAULT_FRAGILE,
      package_weight: DEFAULT_WEIGHT_KG,
      customer_second_phone: '',
    };
  });
}

export function buildDeliveryXlsxBuffer(orders) {
  const rows = ordersToDeliveryRows(orders);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shipments');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
