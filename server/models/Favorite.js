const mongoose = require('mongoose');
const validator = require('validator');

const favoriteSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['music', 'color', 'avatar'],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('favorite', favoriteSchema);
