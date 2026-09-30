const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled',
      maxlength: [60, 'Title cannot exceed 60 characters'],
    },
    canvasData: {
      type: String, // Base64 data URL
      required: [true, 'Canvas data is required'],
    },
    prompt: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    dimensions: {
      width:  { type: Number, default: 800 },
      height: { type: Number, default: 600 },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user queries
creationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Creation', creationSchema);
