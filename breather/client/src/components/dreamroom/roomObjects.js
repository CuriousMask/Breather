export const ROOM_CATEGORIES = [
  { id: 'seating',  label: 'Seating',     icon: '🛋️' },
  { id: 'storage',  label: 'Storage',     icon: '📚' },
  { id: 'lighting', label: 'Lighting',    icon: '💡' },
  { id: 'plants',   label: 'Plants',      icon: '🌿' },
  { id: 'decor',    label: 'Decor',       icon: '🖼️' },
  { id: 'pets',     label: 'Pets & Life', icon: '🐱' },
];

export const ROOM_OBJECTS = [
  // Seating
  { id: 'sofa',       type: 'sofa',      category: 'seating',  label: 'Sofa',        icon: '🛋️', defaultScale: 1.5 },
  { id: 'armchair',   type: 'sofa',      category: 'seating',  label: 'Armchair',    icon: '💺', defaultScale: 1.2 },
  { id: 'bed',        type: 'bed',       category: 'seating',  label: 'Bed',         icon: '🛏️', defaultScale: 1.8 },
  { id: 'beanbag',    type: 'decoration',category: 'seating',  label: 'Bean Bag',    icon: '🪑', defaultScale: 1.0 },
  { id: 'hammock',    type: 'decoration',category: 'seating',  label: 'Hammock',     icon: '🏕️', defaultScale: 1.3 },
  // Storage
  { id: 'bookshelf',  type: 'books',     category: 'storage',  label: 'Bookshelf',   icon: '📚', defaultScale: 1.4 },
  { id: 'desk',       type: 'table',     category: 'storage',  label: 'Desk',        icon: '🖥️', defaultScale: 1.3 },
  { id: 'dresser',    type: 'table',     category: 'storage',  label: 'Dresser',     icon: '🗄️', defaultScale: 1.2 },
  { id: 'table',      type: 'table',     category: 'storage',  label: 'Side Table',  icon: '🪑', defaultScale: 1.0 },
  // Lighting
  { id: 'floor-lamp', type: 'lamp',      category: 'lighting', label: 'Floor Lamp',  icon: '🪔', defaultScale: 1.1 },
  { id: 'desk-lamp',  type: 'lamp',      category: 'lighting', label: 'Desk Lamp',   icon: '💡', defaultScale: 0.9 },
  { id: 'fairy',      type: 'lamp',      category: 'lighting', label: 'Fairy Lights',icon: '✨', defaultScale: 1.2 },
  { id: 'candle',     type: 'lamp',      category: 'lighting', label: 'Candles',     icon: '🕯️', defaultScale: 0.8 },
  // Plants
  { id: 'monstera',   type: 'plant',     category: 'plants',   label: 'Monstera',    icon: '🌿', defaultScale: 1.2 },
  { id: 'cactus',     type: 'plant',     category: 'plants',   label: 'Cactus',      icon: '🌵', defaultScale: 1.0 },
  { id: 'vase-plant', type: 'plant',     category: 'plants',   label: 'Vase Plant',  icon: '🌺', defaultScale: 1.0 },
  { id: 'succulent',  type: 'plant',     category: 'plants',   label: 'Succulents',  icon: '🪴', defaultScale: 0.9 },
  { id: 'hanging',    type: 'plant',     category: 'plants',   label: 'Hanging Plant',icon: '🌱', defaultScale: 1.0 },
  // Decor
  { id: 'painting',   type: 'poster',    category: 'decor',    label: 'Painting',    icon: '🖼️', defaultScale: 1.2 },
  { id: 'clock',      type: 'decoration',category: 'decor',    label: 'Clock',       icon: '🕐', defaultScale: 0.9 },
  { id: 'mirror',     type: 'window',    category: 'decor',    label: 'Mirror',      icon: '🪞', defaultScale: 1.2 },
  { id: 'rug',        type: 'decoration',category: 'decor',    label: 'Rug',         icon: '🟫', defaultScale: 1.6 },
  { id: 'window',     type: 'window',    category: 'decor',    label: 'Window',      icon: '🪟', defaultScale: 1.3 },
  { id: 'poster',     type: 'poster',    category: 'decor',    label: 'Poster',      icon: '📌', defaultScale: 1.1 },
  // Pets & life
  { id: 'cat',        type: 'pet',       category: 'pets',     label: 'Cat',         icon: '🐱', defaultScale: 0.9 },
  { id: 'dog',        type: 'pet',       category: 'pets',     label: 'Dog',         icon: '🐶', defaultScale: 1.0 },
  { id: 'fish-tank',  type: 'pet',       category: 'pets',     label: 'Fish Tank',   icon: '🐠', defaultScale: 1.1 },
  { id: 'guitar',     type: 'decoration',category: 'pets',     label: 'Guitar',      icon: '🎸', defaultScale: 1.1 },
  { id: 'record',     type: 'decoration',category: 'pets',     label: 'Record Player',icon: '📻', defaultScale: 1.0 },
  { id: 'mug',        type: 'decoration',category: 'pets',     label: 'Coffee Mug',  icon: '☕', defaultScale: 0.7 },
];

export const ROOM_THEMES = [
  { id: 'cozy',     label: 'Cozy',     wallColor: '#F8F4EE', floorColor: '#D4A574', ambientColor: '#FFF8E7', icon: '🍂' },
  { id: 'minimal',  label: 'Minimal',  wallColor: '#F5F5F5', floorColor: '#E0E0E0', ambientColor: '#FFFFFF', icon: '⬜' },
  { id: 'bohemian', label: 'Bohemian', wallColor: '#FDF0E0', floorColor: '#C19A6B', ambientColor: '#FFE4B5', icon: '🪬' },
  { id: 'modern',   label: 'Modern',   wallColor: '#2D3748', floorColor: '#4A5568', ambientColor: '#E2E8F0', icon: '🏙️' },
  { id: 'nature',   label: 'Nature',   wallColor: '#E8F5E9', floorColor: '#A5C89F', ambientColor: '#F0FFF4', icon: '🌿' },
  { id: 'pastel',   label: 'Pastel',   wallColor: '#FDE8F0', floorColor: '#E8D5F5', ambientColor: '#FFF0FB', icon: '🌸' },
];

export const LIGHTING_OPTIONS = [
  { id: 'bright', label: 'Bright', icon: '☀️', overlay: 'rgba(255,255,255,0)' },
  { id: 'warm',   label: 'Warm',   icon: '🕯️', overlay: 'rgba(255,180,80,0.08)' },
  { id: 'dim',    label: 'Dim',    icon: '🌆', overlay: 'rgba(0,0,0,0.15)' },
  { id: 'night',  label: 'Night',  icon: '🌙', overlay: 'rgba(15,30,80,0.35)' },
  { id: 'sunset', label: 'Sunset', icon: '🌅', overlay: 'rgba(255,100,50,0.12)' },
];
