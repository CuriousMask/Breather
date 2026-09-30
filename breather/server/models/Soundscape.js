const mongoose = require('mongoose');

const soundTrackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    volume: { type: Number, default: 0.5, min: 0, max: 1 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const soundscapeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Preset name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    sounds: [soundTrackSchema],
    masterVolume: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

soundscapeSchema.index({ userId: 1 });

module.exports = mongoose.model('Soundscape', soundscapeSchema);
