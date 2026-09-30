const { sendSuccess } = require('../utils/response');

const ENVIRONMENTS = [
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    description: 'Watch rain trace its quiet paths down the glass',
    icon: '🌧️',
    gradient: ['#4a6fa5', '#6b8cba', '#8baad4'],
    sounds: ['rain', 'thunder'],
    mood: 'calm',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Drift with endless waves under an open sky',
    icon: '🌊',
    gradient: ['#006994', '#0e86c7', '#7da7d9'],
    sounds: ['ocean', 'seagulls', 'wind'],
    mood: 'serene',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Breathe in the stillness of ancient trees',
    icon: '🌲',
    gradient: ['#1a4a2e', '#2d7a4f', '#5aab71'],
    sounds: ['forest', 'birds', 'wind'],
    mood: 'peaceful',
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    description: 'Lose yourself in a field of a thousand stars',
    icon: '✨',
    gradient: ['#0d1b2a', '#1a2744', '#2d4a6e'],
    sounds: ['night-ambience', 'crickets'],
    mood: 'dreamy',
  },
  {
    id: 'clouds',
    name: 'Clouds',
    description: 'Float above the world in soft drifting silence',
    icon: '☁️',
    gradient: ['#e8f4fd', '#bdd9f2', '#7da7d9'],
    sounds: ['wind', 'light-breeze'],
    mood: 'airy',
  },
];

exports.getEnvironments = async (req, res, next) => {
  try {
    return sendSuccess(res, { environments: ENVIRONMENTS });
  } catch (err) { next(err); }
};
