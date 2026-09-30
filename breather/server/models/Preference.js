const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    favoriteEnvironment: {
      type: String,
      enum: ['rainy-window', 'ocean', 'forest', 'night-sky', 'clouds', ''],
      default: '',
    },
    lastEnvironment: {
      type: String,
      enum: ['rainy-window', 'ocean', 'forest', 'night-sky', 'clouds', ''],
      default: '',
    },
    favoriteActivity: {
      type: String,
      enum: ['bubble-pop', 'falling-stars', 'particles', 'connect-dots', 'shapes', ''],
      default: '',
    },
    activityHistory: [
      {
        activity: String,
        playedAt: { type: Date, default: Date.now },
      },
    ],
    recentModules: {
      type: [String],
      enum: ['garden', 'studio', 'escape', 'playzone', 'soundscape', 'dreamroom'],
      default: [],
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Preference', preferenceSchema);
