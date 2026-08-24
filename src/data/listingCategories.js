import { Home, Building2, Layers, DoorOpen, Building, BedDouble, Trees, Store } from 'lucide-react';

export const LISTING_CATEGORIES = [
  { value: 'villa', label: 'Villa', icon: Home },
  { value: 'appartement', label: 'Appartement', icon: Building2 },
  { value: 'duplex', label: 'Duplex', icon: Layers },
  { value: 'studio', label: 'Studio', icon: DoorOpen },
  { value: 'maison', label: 'Maison', icon: Building },
  { value: 'chambre', label: 'Chambre', icon: BedDouble },
  { value: 'terrain', label: 'Terrain', icon: Trees },
  { value: 'bureau_commerce', label: 'Bureau / Commerce', icon: Store },
];

export function getCategoryLabel(value) {
  return LISTING_CATEGORIES.find(c => c.value === value)?.label || value;
}

export function getCategoryIcon(value) {
  return LISTING_CATEGORIES.find(c => c.value === value)?.icon || Home;
}