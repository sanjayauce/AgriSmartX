import axios from 'axios';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Products.css';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { user } = useAuth();
  const [dealerStock, setDealerStock] = useState([]);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [requestQty, setRequestQty] = useState('');
  const [loadingDealers, setLoadingDealers] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [retailerRequests, setRetailerRequests] = useState([]);
  // Fetch retailer requests on mount and after submitting/cancelling
  const fetchRetailerRequests = React.useCallback(async () => {
    if (!user?.roleId) return;
    try {
      const res = await axios.get(`http://localhost:5005/api/inventory/retailer-requests/retailer/${user.roleId}`);
      setRetailerRequests(res.data || []);
    } catch (err) {
      setRetailerRequests([]);
    }
  }, [user]);
  React.useEffect(() => { fetchRetailerRequests(); }, [fetchRetailerRequests]);

  // After successful request, refresh table
  React.useEffect(() => {
    if (successMsg) fetchRetailerRequests();
  }, [successMsg, fetchRetailerRequests]);

  // Cancel request handler
  const handleCancelRequest = async (id) => {
    try {
      await axios.patch(`http://localhost:5005/api/inventory/retailer-requests/${id}`);
      fetchRetailerRequests();
    } catch (err) {
      window.alert('Failed to cancel request.');
    }
  };

  // Fetch all available dealer stock on mount
  React.useEffect(() => {
    const fetchDealerStock = async () => {
      setLoadingDealers(true);
      try {
        const res = await axios.get('http://localhost:5005/api/inventory/dealer-stock/available');
        setDealerStock(res.data || []);
      } catch (err) {
        setDealerStock([]);
      } finally {
        setLoadingDealers(false);
      }
    };
    fetchDealerStock();
  }, []);

  const handleOpenRequestModal = () => {
    setOpenRequestModal(true);
    setSelectedDealer('');
    setSelectedItem('');
    setRequestQty('');
    setRequestError('');
    setSuccessMsg('');
  };
  const handleCloseRequestModal = () => {
    setOpenRequestModal(false);
  };

  const handleDealerChange = (e) => {
    setSelectedDealer(e.target.value);
    setSelectedItem('');
    setRequestQty('');
    setRequestError('');
    setSuccessMsg('');
  };
  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
    setRequestQty('');
    setRequestError('');
    setSuccessMsg('');
  };
  const handleQtyChange = (e) => {
    setRequestQty(e.target.value);
  };

  const handleRequestSubmit = async () => {
    setRequestError('');
    setSuccessMsg('');
    if (!selectedDealer || !selectedItem || !requestQty) {
      setRequestError('Please select dealer, item, and enter quantity.');
      return;
    }
    const dealer = dealerStock.find(d => d.dealerId === selectedDealer);
    const item = dealer?.items.find(i => i.dealerStockId === selectedItem);
    if (!item) {
      setRequestError('Invalid item selection.');
      return;
    }
    if (Number(requestQty) > Number(item.quantity)) {
      setRequestError('Requested quantity exceeds available stock.');
      return;
    }
    try {
      await axios.post('http://localhost:5005/api/inventory/retailer-requests', {
        retailerId: user.roleId,
        retailerEmail: user.email,
        dealerId: dealer.dealerId,
        dealerEmail: dealer.dealerEmail,
        dealerStockId: item.dealerStockId,
        itemName: item.itemName,
        category: item.category,
        requestedQty: Number(requestQty),
        unit: item.unit,
        price: item.price
      });
      setSuccessMsg('Request submitted successfully!');
      setRequestQty('');
    } catch (err) {
      setRequestError('Failed to submit request.');
    }
  };

  // Only show requested and accepted products
  const visibleProducts = retailerRequests.filter(req => req.status === 'requested' || req.status === 'accepted');

  // Remove all dummy/static data and only show real dealer request UI and table
  return (
    <div className="retailer-products">
      <div className="products-header">
        <div className="header-content">
          <h1>Products Management</h1>
          <p className="welcome-message">Manage your product inventory and stock levels.</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn" onClick={handleOpenRequestModal}>
            <FaPlus /> Request from Dealer
          </button>
        </div>
      </div>
      {/* Dealer Request Modal */}
      {openRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select Dealer & Stock Amount</h2>
            <div style={{ marginBottom: 16 }}>
              <label>Dealer</label>
              <select value={selectedDealer} onChange={handleDealerChange} style={{ width: '100%', marginBottom: 8 }}>
                <option value="">Select Dealer</option>
                {dealerStock.map(d => (
                  <option key={d.dealerId} value={d.dealerId}>{d.dealerEmail} ({d.dealerId})</option>
                ))}
                  </select>
              {selectedDealer && (
                <>
                  <label>Item</label>
                  <select value={selectedItem} onChange={handleItemChange} style={{ width: '100%', marginBottom: 8 }}>
                    <option value="">Select Item</option>
                    {dealerStock.find(d => d.dealerId === selectedDealer)?.items.map(item => (
                      <option key={item.dealerStockId} value={item.dealerStockId}>
                        {item.itemName} ({item.category}) - {item.quantity} {item.unit} available @ {item.price}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {selectedItem && (
                <>
                  <label>Required Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={dealerStock.find(d => d.dealerId === selectedDealer)?.items.find(i => i.dealerStockId === selectedItem)?.quantity || 1}
                    value={requestQty}
                    onChange={handleQtyChange}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  {/* Show price as read-only field */}
                  <label>Price</label>
                  <input
                    type="text"
                    value={dealerStock.find(d => d.dealerId === selectedDealer)?.items.find(i => i.dealerStockId === selectedItem)?.price || ''}
                    readOnly
                    style={{ width: '100%', marginBottom: 8, background: '#f8f9fa', color: '#333' }}
                  />
                </>
              )}
              {requestError && <div style={{ color: 'red', marginBottom: 8 }}>{requestError}</div>}
              {successMsg && <div style={{ color: 'green', marginBottom: 8 }}>{successMsg}</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={handleCloseRequestModal}>Cancel</button>
              <button onClick={handleRequestSubmit} disabled={!selectedDealer || !selectedItem || !requestQty} style={{ background: '#1976d2', color: '#fff' }}>Request</button>
            </div>
          </div>
        </div>
      )}
      {/* Products Table - Show requested and accepted products, with status badge */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Dealer</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {visibleProducts.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.category}</td>
              <td>{item.dealerEmail} ({item.dealerId})</td>
              <td>{item.requestedQty}</td>
              <td>{item.unit}</td>
              <td>{item.price}</td>
              <td>
                <span className={`status-badge ${item.status}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
              </td>
              <td>{new Date(item.updatedAt || item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
