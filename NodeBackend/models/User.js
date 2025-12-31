const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { // Stored in plain text (not secure!)
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    unique: true,
    sparse: true // This allows null/undefined values and maintains uniqueness for non-null values
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
