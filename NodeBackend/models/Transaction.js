const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  wholesalerRoleId: { type: String, required: true },
  dealerId: { type: String, required: true },
  dealerEmail: { type: String, required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: String, required: true },
  total: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['due', 'done'], default: 'due' },
  paymentMethod: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 