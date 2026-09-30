/**
 * Garden object catalogue.
 * Each item has: id, type, label, icon (emoji), variants, category
 */

export const GARDEN_CATEGORIES = [
  { id: 'trees',       label: 'Trees',       icon: '🌳' },
  { id: 'flowers',     label: 'Flowers',     icon: '🌸' },
  { id: 'plants',      label: 'Plants',      icon: '🌿' },
  { id: 'water',       label: 'Water',       icon: '💧' },
  { id: 'stones',      label: 'Stones',      icon: '🪨' },
  { id: 'decorations', label: 'Decor',       icon: '🏮' },
];

export const GARDEN_OBJECTS = [
  // ── Trees ──
  { id: 'oak',      type: 'tree',    label: 'Oak Tree',     icon: '🌳', category: 'trees',       defaultScale: 1.4 },
  { id: 'pine',     type: 'tree',    label: 'Pine Tree',    icon: '🌲', category: 'trees',       defaultScale: 1.4 },
  { id: 'palm',     type: 'tree',    label: 'Palm Tree',    icon: '🌴', category: 'trees',       defaultScale: 1.4 },
  { id: 'sakura',   type: 'tree',    label: 'Cherry Tree',  icon: '🌸', category: 'trees',       defaultScale: 1.3 },
  { id: 'maple',    type: 'tree',    label: 'Maple Tree',   icon: '🍁', category: 'trees',       defaultScale: 1.2 },
  { id: 'bamboo',   type: 'tree',    label: 'Bamboo',       icon: '🎋', category: 'trees',       defaultScale: 1.3 },

  // ── Flowers ──
  { id: 'sunflower',type: 'flower',  label: 'Sunflower',    icon: '🌻', category: 'flowers',     defaultScale: 1.0 },
  { id: 'tulip',    type: 'flower',  label: 'Tulip',        icon: '🌷', category: 'flowers',     defaultScale: 0.9 },
  { id: 'rose',     type: 'flower',  label: 'Rose',         icon: '🌹', category: 'flowers',     defaultScale: 0.9 },
  { id: 'blossom',  type: 'flower',  label: 'Blossom',      icon: '🌼', category: 'flowers',     defaultScale: 0.9 },
  { id: 'hibiscus', type: 'flower',  label: 'Hibiscus',     icon: '🌺', category: 'flowers',     defaultScale: 1.0 },
  { id: 'orchid',   type: 'flower',  label: 'Orchid',       icon: '💐', category: 'flowers',     defaultScale: 1.0 },

  // ── Plants ──
  { id: 'cactus',   type: 'plant',   label: 'Cactus',       icon: '🌵', category: 'plants',      defaultScale: 1.0 },
  { id: 'herb',     type: 'plant',   label: 'Herb',         icon: '🌿', category: 'plants',      defaultScale: 0.9 },
  { id: 'sprout',   type: 'plant',   label: 'Sprout',       icon: '🌱', category: 'plants',      defaultScale: 0.8 },
  { id: 'fern',     type: 'plant',   label: 'Fern',         icon: '🍀', category: 'plants',      defaultScale: 0.9 },
  { id: 'reed',     type: 'plant',   label: 'Reed',         icon: '🎍', category: 'plants',      defaultScale: 1.0 },
  { id: 'mushroom', type: 'plant',   label: 'Mushroom',     icon: '🍄', category: 'plants',      defaultScale: 0.8 },

  // ── Water ──
  { id: 'pond',     type: 'water',   label: 'Pond',         icon: '🫧', category: 'water',       defaultScale: 1.4 },
  { id: 'wave',     type: 'water',   label: 'Waves',        icon: '🌊', category: 'water',       defaultScale: 1.3 },
  { id: 'droplet',  type: 'water',   label: 'Droplet',      icon: '💧', category: 'water',       defaultScale: 0.9 },
  { id: 'fountain', type: 'water',   label: 'Fountain',     icon: '⛲', category: 'water',       defaultScale: 1.2 },
  { id: 'waterfall',type: 'water',   label: 'Waterfall',    icon: '🌁', category: 'water',       defaultScale: 1.3 },
  { id: 'fish',     type: 'water',   label: 'Fish',         icon: '🐠', category: 'water',       defaultScale: 0.9 },

  // ── Stones ──
  { id: 'boulder',  type: 'stone',   label: 'Boulder',      icon: '🪨', category: 'stones',      defaultScale: 1.1 },
  { id: 'pebble',   type: 'stone',   label: 'Pebbles',      icon: '⚪', category: 'stones',      defaultScale: 0.8 },
  { id: 'lantern',  type: 'stone',   label: 'Lantern',      icon: '🏮', category: 'stones',      defaultScale: 1.0 },
  { id: 'pagoda',   type: 'stone',   label: 'Pagoda',       icon: '⛩️', category: 'stones',      defaultScale: 1.2 },
  { id: 'stepping', type: 'stone',   label: 'Step Stone',   icon: '🥏', category: 'stones',      defaultScale: 0.9 },
  { id: 'arch',     type: 'stone',   label: 'Stone Arch',   icon: '🗿', category: 'stones',      defaultScale: 1.1 },

  // ── Decorations ──
  { id: 'bench',    type: 'decoration', label: 'Bench',     icon: '🪑', category: 'decorations', defaultScale: 1.0 },
  { id: 'butterfly',type: 'decoration', label: 'Butterfly', icon: '🦋', category: 'decorations', defaultScale: 0.9 },
  { id: 'bird',     type: 'decoration', label: 'Bird',      icon: '🐦', category: 'decorations', defaultScale: 0.9 },
  { id: 'rabbit',   type: 'decoration', label: 'Rabbit',    icon: '🐰', category: 'decorations', defaultScale: 0.9 },
  { id: 'bridge',   type: 'decoration', label: 'Bridge',    icon: '🌉', category: 'decorations', defaultScale: 1.3 },
  { id: 'windmill', type: 'decoration', label: 'Windmill',  icon: '💨', category: 'decorations', defaultScale: 1.1 },
];

export const getObjectById = (id) => GARDEN_OBJECTS.find((o) => o.id === id || o.type === id);

export const getObjectsByCategory = (categoryId) =>
  GARDEN_OBJECTS.filter((o) => o.category === categoryId);
