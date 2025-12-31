const mongoose = require('mongoose');

const RetailerRequestSchema = new mongoose.Schema({
  retailerId: { type: String, required: true },
  retailerEmail: { type: String, required: true },
  dealerId: { type: String, required: true },
  dealerEmail: { type: String, required: true },
  dealerStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'DealerStock', required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  requestedQty: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, default: 'requested' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RetailerRequest', RetailerRequestSchema); 