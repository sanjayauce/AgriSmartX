const mongoose = require('mongoose');

const DealerStockSchema = new mongoose.Schema({
  dealerId: { type: String, required: true },
  dealerEmail: { type: String, required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: String, required: true },
  dealerRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DealerRequest' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DealerStock', DealerStockSchema); 