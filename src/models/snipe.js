const mongoose = require('mongoose');

const snipeSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  content: { type: String },
  author: { type: Object, required: true },
  image: { type: String },
});

module.exports = mongoose.model('Snipe', snipeSchema);
