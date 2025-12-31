import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaBox, FaClipboardList, FaMoneyBillWave, FaWarehouse } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [retailerRequests, setRetailerRequests] = useState([]);
  const [acceptedProducts, setAcceptedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/retailer-requests/retailer/${user.roleId}`);
        setRetailerRequests(res.data || []);
        setAcceptedProducts((res.data || []).filter(req => req.status === 'accepted'));
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [user]);

  // Stats
  const totalAccepted = acceptedProducts.length;
  const totalRequests = retailerRequests.length;
  const totalValue = acceptedProducts.reduce((sum, item) => {
    const priceNum = parseFloat((item.price || '').replace(/[^\d.]/g, '')) || 0;
    return sum + (priceNum * item.requestedQty);
  }, 0);

  const stats = [
    {
      label: 'Accepted Products',
      value: totalAccepted,
      icon: <FaBox />, 
      trend: '',
      trendDirection: 'up',
      subLabel: 'Current inventory'
    },
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: <FaClipboardList />, 
      trend: '',
      trendDirection: 'up',
      subLabel: 'All time'
    },
    {
      label: 'Inventory Value',
      value: `₹${totalValue.toLocaleString()}`,
      icon: <FaMoneyBillWave />, 
      trend: '',
      trendDirection: 'up',
      subLabel: 'Accepted stock value'
    }
  ];

  // Inventory status by category
  const categories = ['Grains', 'Vegetables', 'Fruits', 'Dairy'];
  const inventoryStatus = categories.map(category => {
    const items = acceptedProducts.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
    const stock = items.reduce((sum, item) => sum + (item.requestedQty || 0), 0);
    const capacity = items.length > 0 ? stock * 2 : 1000;
    let status = 'critical';
    if (capacity > 0) {
      const percent = stock / capacity;
      if (percent > 0.5) status = 'healthy';
      else if (percent > 0.2) status = 'warning';
    }
    return { category, stock, capacity, status };
  });

  const getStatusColor = (status) => {
    const colors = {
      healthy: '#4CAF50',
      warning: '#FFA726',
      critical: '#F44336',
      accepted: '#4CAF50',
      rejected: '#F44336',
      requested: '#FFA726'
    };
    return colors[status] || '#757575';
  };

  if (loading) {
    return <div className="retailer-dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="retailer-dashboard">{error}</div>;
  }

  return (
    <div className="retailer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Retailer Dashboard</h1>
          <p className="welcome-message">Welcome, {user?.email}!</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="wholesaler-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="wholesaler-stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
              <div className="stat-trend">
                <span className={`trend ${stat.trendDirection}`}>
                  {stat.trendDirection === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.trend}
                </span>
                <span className="sub-label">{stat.subLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        {/* Recent Requests */}
        <div className="dashboard-card recent-orders-card">
          <h2>Recent Dealer Requests</h2>
          {retailerRequests.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="requested-items-table">
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
                  {retailerRequests.slice(0, 5).map((req) => (
                    <tr key={req._id}>
                      <td>{req.itemName}</td>
                      <td>{req.category}</td>
                      <td>{req.dealerEmail} ({req.dealerId})</td>
                      <td>{req.requestedQty} {req.unit}</td>
                      <td>{req.price}</td>
                      <td><span className={`requested-badge ${req.status}`}>{req.status}</span></td>
                      <td>{new Date(req.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No dealer requests yet.</div>
          )}
        </div>
        {/* Inventory Status */}
        <div className="dashboard-card inventory-status">
          <h2><FaWarehouse /> Inventory Status</h2>
          <div className="inventory-list">
            {inventoryStatus.map((item, index) => (
              <div key={index} className="inventory-item">
                <div className="inventory-header">
                  <span className="category">{item.category}</span>
                  <span className={`status ${item.status}`}>{item.status}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ 
                      width: `${(item.stock / item.capacity) * 100}%`,
                      backgroundColor: getStatusColor(item.status)
                    }}
                  ></div>
                </div>
                <div className="inventory-details">
                  <span>{item.stock} units</span>
                  <span>of {item.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/retailer/products'}>View Products</button>
            <button className="action-btn" onClick={() => window.location.href = '/retailer/orders'}>View Orders</button>
            <button className="action-btn" onClick={() => window.location.href = '/retailer/support'}>Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
