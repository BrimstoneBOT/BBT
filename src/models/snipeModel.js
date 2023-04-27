const mongoose = require('mongoose');

const deletedMessageSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  messageId: { type: String, required: true },
  content: { type: String },
  author: {
    id: { type: String, required: true },
    tag: { type: String, required: true },
  },
  deletedAt: { type: Date, required: true },
});

module.exports = mongoose.model('DeletedMessage', deletedMessageSchema);
