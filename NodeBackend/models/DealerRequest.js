const mongoose = require('mongoose');

const DealerRequestSchema = new mongoose.Schema({
  dealerId: { type: String, required: true },
  dealerEmail: { type: String, required: true },
  wholesalerRoleId: { type: String, required: true },
  wholesalerEmail: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  requestedQty: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, default: 'requested' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DealerRequest', DealerRequestSchema); 