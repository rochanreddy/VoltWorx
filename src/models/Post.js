const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Post', PostSchema); 