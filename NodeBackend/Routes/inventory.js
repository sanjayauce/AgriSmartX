const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/Inventory');
const Order = require('../models/Order');
const DealerRequest = require('../models/DealerRequest');
const Transaction = require('../models/Transaction');
const DealerStock = require('../models/DealerStock');
const RetailerRequest = require('../models/RetailerRequest');
// Add item
router.post('/add', async (req, res) => {
  try {
    const { name, category, quantity, unit, price, reorderLevel, wholesalerId } = req.body; // wholesalerId is now a string (roleId)
    const newItem = new InventoryItem({ name, category, quantity, unit, price, reorderLevel, wholesalerId });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by wholesaler (roleId)
router.get('/:wholesalerId', async (req, res) => {
  try {
    const items = await InventoryItem.find({ wholesalerId: req.params.wholesalerId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by wholesaler (roleId)
router.get('/orders/:wholesalerId', async (req, res) => {
  try {
    const orders = await Order.find({ wholesalerId: req.params.wholesalerId }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Dealer creates a new stock request
router.post('/dealer-requests', async (req, res) => {
  try {
    const request = new DealerRequest(req.body);
    await request.save();
    res.status(201).json({ message: 'Request submitted', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Wholesaler fetches all requests addressed to them
router.get('/dealer-requests/wholesaler/:roleId', async (req, res) => {
  try {
    const requests = await DealerRequest.find({ wholesalerRoleId: req.params.roleId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Dealer fetches all their requests
router.get('/dealer-requests/dealer/:dealerId', async (req, res) => {
  try {
    const requests = await DealerRequest.find({ dealerId: req.params.dealerId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update status of a dealer request
router.patch('/dealer-requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await DealerRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Request not found' });
    // If accepted, create a transaction
    if (status === 'accepted') {
      const priceNum = updated.price ? Number(String(updated.price).replace(/[^\d.]/g, '')) : 0;
      const total = priceNum * Number(updated.requestedQty);
      await Transaction.create({
        wholesalerRoleId: updated.wholesalerRoleId,
        dealerId: updated.dealerId,
        dealerEmail: updated.dealerEmail,
        itemName: updated.itemName,
        category: updated.category,
        quantity: updated.requestedQty,
        unit: updated.unit,
        price: updated.price,
        total,
        date: new Date()
      });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Upsert dealer stock (for dealer inventory management)
router.post('/dealer-stock', async (req, res) => {
  try {
    const { dealerId, dealerEmail, itemName, category, quantity, unit, price, dealerRequestId } = req.body;
    if (!dealerId || !itemName || !category || !unit || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Upsert by dealerId + itemName + category + unit
    const filter = { dealerId, itemName, category, unit };
    const update = { dealerEmail, quantity, price, dealerRequestId, createdAt: new Date() };
    const stock = await DealerStock.findOneAndUpdate(filter, update, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.status(200).json({ message: 'Dealer stock updated', stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all transactions for a wholesaler
router.get('/transactions/:wholesalerRoleId', async (req, res) => {
  try {
    const txns = await Transaction.find({ wholesalerRoleId: req.params.wholesalerRoleId }).sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update payment status of a transaction
router.patch('/transactions/:id', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All dealers with available stock (quantity > 0)
router.get('/dealer-stock/available', async (req, res) => {
  try {
    const stocks = await DealerStock.find({ quantity: { $gt: 0 } });
    // Group by dealerId
    const dealers = {};
    stocks.forEach(stock => {
      if (!dealers[stock.dealerId]) {
        dealers[stock.dealerId] = {
          dealerId: stock.dealerId,
          dealerEmail: stock.dealerEmail,
          items: []
        };
      }
      dealers[stock.dealerId].items.push({
        dealerStockId: stock._id,
        itemName: stock.itemName,
        category: stock.category,
        quantity: stock.quantity,
        unit: stock.unit,
        price: stock.price
      });
    });
    res.json(Object.values(dealers));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Retailer creates a new stock request to dealer
router.post('/retailer-requests', async (req, res) => {
  try {
    const { retailerId, retailerEmail, dealerId, dealerEmail, dealerStockId, itemName, category, requestedQty, unit, price } = req.body;
    if (!retailerId || !dealerId || !dealerStockId || !itemName || !category || !requestedQty || !unit || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const request = new RetailerRequest({
      retailerId,
      retailerEmail,
      dealerId,
      dealerEmail,
      dealerStockId,
      itemName,
      category,
      requestedQty,
      unit,
      price,
      status: 'requested'
    });
    await request.save();
    res.status(201).json({ message: 'Retailer request submitted', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Retailer fetches all their requests
router.get('/retailer-requests/retailer/:retailerId', async (req, res) => {
  try {
    const requests = await RetailerRequest.find({ retailerId: req.params.retailerId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Dealer fetches all retailer requests addressed to them
router.get('/retailer-requests/dealer/:dealerId', async (req, res) => {
  try {
    const requests = await RetailerRequest.find({ dealerId: req.params.dealerId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update status of a retailer request (accept/reject/cancel)
router.patch('/retailer-requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await RetailerRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Request not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
