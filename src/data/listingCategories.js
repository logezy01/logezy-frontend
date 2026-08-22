export const LISTING_CATEGORIES = [
  { value: 'villa', label: 'Villa', icon: '🏡' },
  { value: 'appartement', label: 'Appartement', icon: '🏢' },
  { value: 'duplex', label: 'Duplex', icon: '🏘️' },
  { value: 'studio', label: 'Studio', icon: '🚪' },
  { value: 'maison', label: 'Maison', icon: '🏠' },
  { value: 'chambre', label: 'Chambre', icon: '🛏️' },
  { value: 'terrain', label: 'Terrain', icon: '🌍' },
  { value: 'bureau_commerce', label: 'Bureau / Commerce', icon: '🏬' },
];

export function getCategoryLabel(value) {
  return LISTING_CATEGORIES.find(c => c.value === value)?.label || value;
}

export function getCategoryIcon(value) {
  return LISTING_CATEGORIES.find(c => c.value === value)?.icon || '🏠';
}