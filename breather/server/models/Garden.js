const mongoose = require('mongoose');

const gardenObjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['tree', 'flower', 'plant', 'stone', 'water', 'decoration', 'path', 'bench', 'fountain'],
    },
    variant: { type: String, default: 'default' },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    scale: { type: Number, default: 1 },
    rotation: { type: Number, default: 0 },
    zIndex: { type: Number, default: 1 },
  },
  { _id: false }
);

const gardenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    objects: [gardenObjectSchema],
    environment: {
      type: String,
      enum: ['day', 'night', 'sunset', 'sunrise'],
      default: 'day',
    },
    weather: {
      type: String,
      enum: ['clear', 'cloudy', 'rain', 'snow', 'fog'],
      default: 'clear',
    },
    theme: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'zen', 'tropical'],
      default: 'spring',
    },
    backgroundColor: { type: String, default: '#87CEEB' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Garden', gardenSchema);
