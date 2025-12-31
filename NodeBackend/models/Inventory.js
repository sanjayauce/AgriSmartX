const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: String, required: true },
  reorderLevel: { type: Number, required: true },
  wholesalerId: { type: String, required: true }, // Use roleId (e.g., w1) instead of ObjectId
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
