const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ['student', 'startup'] },
  avatarUrl: String,
});

module.exports = mongoose.model('User', UserSchema); 