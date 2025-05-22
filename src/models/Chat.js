const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Types.ObjectId, ref: 'User' }], // exactly two
  messages: [{
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: String,
    sentAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Chat', ChatSchema); 