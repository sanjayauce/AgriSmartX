import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [retailerRequests, setRetailerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all retailer requests for this user
  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/retailer-requests/retailer/${user.roleId}`);
        setRetailerRequests(res.data || []);
      } catch (err) {
        setError('Failed to fetch dealer requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 4000);
    return () => clearInterval(interval);
  }, [user]);

  // Cancel request handler
  const handleCancelRequest = async (id) => {
    try {
      await axios.patch(`http://localhost:5005/api/inventory/retailer-requests/${id}`, { status: 'cancelled' });
      // Refetch requests
      const res = await axios.get(`http://localhost:5005/api/inventory/retailer-requests/retailer/${user.roleId}`);
      setRetailerRequests(res.data || []);
    } catch (err) {
      setError('Failed to cancel request');
    }
  };

  return (
    <div className="retailer-orders">
      <div className="orders-header">
        <div className="header-content">
          <h1>Orders Management</h1>
          <p className="welcome-message">Manage and track all your dealer requests in one place.</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <FaShoppingCart /> New Order
          </button>
        </div>
      </div>
      <div className="orders-grid">
        <div className="main-content">
          <section className="orders-section">
            <h2>Dealer Requests</h2>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Dealer</th>
                    <th>Requested Qty</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {retailerRequests.map((req) => (
                    <tr key={req._id}>
                      <td>{req.itemName}</td>
                      <td>{req.category}</td>
                      <td>{req.dealerEmail} ({req.dealerId})</td>
                      <td>{req.requestedQty} {req.unit}</td>
                      <td>{req.price}</td>
                      <td><span className={`status-badge ${req.status}`}>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span></td>
                      <td>{new Date(req.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Orders;
