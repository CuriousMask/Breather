const mongoose = require('mongoose');

const roomObjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['sofa', 'bed', 'plant', 'lamp', 'books', 'poster', 'table',
             'decoration', 'window', 'pet', 'rug', 'shelf', 'desk', 'chair'],
    },
    variant: { type: String, default: 'default' },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    scale: { type: Number, default: 1, min: 0.3, max: 3 },
    rotation: { type: Number, default: 0 },
    zIndex: { type: Number, default: 1 },
    color: { type: String, default: '' },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    objects: [roomObjectSchema],
    theme: {
      type: String,
      enum: ['cozy', 'minimal', 'bohemian', 'modern', 'nature', 'dark', 'pastel'],
      default: 'cozy',
    },
    wallColor: { type: String, default: '#F8F4EE' },
    floorColor: { type: String, default: '#D4A574' },
    lighting: {
      type: String,
      enum: ['bright', 'warm', 'dim', 'night', 'sunset'],
      default: 'warm',
    },
    ambientColor: { type: String, default: '#FFF8E7' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
