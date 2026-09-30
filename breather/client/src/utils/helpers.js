/**
 * Breather — Utility Helpers
 */

// Generate a unique ID
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Clamp a number between min and max
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// Debounce function
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Convert canvas to base64
export const canvasToBase64 = (canvas) => canvas.toDataURL('image/png');

// Get initials from name
export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');

// Random item from array
export const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Deep clone an object
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Capitalize first letter
export const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

// Module gradient map
export const MODULE_GRADIENTS = {
  garden:     'linear-gradient(135deg, #A5C89F, #7DA7D9)',
  studio:     'linear-gradient(135deg, #C7B8EA, #F9A8D4)',
  escape:     'linear-gradient(135deg, #7DA7D9, #4a90d9)',
  playzone:   'linear-gradient(135deg, #FCD34D, #F9A8D4)',
  soundscape: 'linear-gradient(135deg, #C7B8EA, #7DA7D9)',
  dreamroom:  'linear-gradient(135deg, #F9A8D4, #C7B8EA)',
};
