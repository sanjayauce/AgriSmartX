const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customer: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, required: true },
  priority: { type: String, required: true },
  wholesalerId: { type: String, required: true }, // roleId
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema); 