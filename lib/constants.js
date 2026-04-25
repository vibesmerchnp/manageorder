// Status lifecycle for an order
export const STATUSES = [
  'Pending',
  'Designed',
  'Printed',
  'Pressed',
  'Packed',
  'Shipped',
];

// Pill colors for each status
export const STATUS_STYLE = {
  Pending: { bg: '#EFE6D8', fg: '#5C504A', d: '#A8998C' },
  Designed: { bg: '#E2EAF1', fg: '#2C4566', d: '#5B89C7' },
  Printed: { bg: '#F0E5C8', fg: '#7A5B1A', d: '#C7A156' },
  Pressed: { bg: '#F4D9C2', fg: '#8E3B25', d: '#D87B3C' },
  Packed: { bg: '#DDE7D8', fg: '#3D5B33', d: '#7A9B69' },
  Shipped: { bg: '#1F1A16', fg: '#FBF7F0', d: '#FBF7F0' },
};

// Design slot labels (where on shirt)
export const DESIGN_LABELS = [
  'Front Chest',
  'Front Center',
  'Back',
  'Left Sleeve',
  'Right Sleeve',
  'Custom',
];

// Sender location for delivery xlsx
export const SENDER_LOCATION = 'TINKUNE';
export const DEFAULT_WEIGHT_KG = 1;
export const DEFAULT_FRAGILE = 'No';

// Statuses that need to appear in press mode
export const PRESS_STATUSES = ['Designed', 'Printed', 'Pending'];

// Statuses ready to ship
export const SHIP_STATUSES = ['Packed'];
