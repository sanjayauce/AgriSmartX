import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaArrowDown,
  FaArrowUp,
  FaBox,
  FaChartBar,
  FaChartLine,
  FaClipboardList,
  FaMoneyBillWave,
  FaWarehouse
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [retailerRequests, setRetailerRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [invRes, reqRes] = await Promise.all([
          axios.get(`http://localhost:5005/api/inventory/dealer-stock/available`),
          axios.get(`http://localhost:5005/api/inventory/retailer-requests/dealer/${user.roleId}`)
        ]);
        // Filter inventory for this dealer
        const dealerInv = (invRes.data.find(d => d.dealerId === user.roleId)?.items) || [];
        setInventory(dealerInv);
        setRetailerRequests(reqRes.data || []);
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

  // Accept/Reject handler
  const handleRequestAction = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5005/api/inventory/retailer-requests/${id}`, { status });
      const res = await axios.get(`http://localhost:5005/api/inventory/retailer-requests/dealer/${user.roleId}`);
      setRetailerRequests(res.data || []);
    } catch (err) {
      setError('Failed to update request status');
    }
  };

  // Helper for badge color
  const getStatusClass = (status) => {
    if (status === 'accepted') return 'accepted';
    if (status === 'rejected') return 'rejected';
    if (status === 'requested') return 'requested';
    return '';
  };

  // Stats
  const totalSKUs = inventory.length;
  const totalRequests = retailerRequests.length;
  const totalInventoryValue = inventory.reduce((sum, item) => {
    const priceNum = parseFloat((item.price || '').replace(/[^\d.]/g, '')) || 0;
    return sum + (priceNum * item.quantity);
  }, 0);

  const stats = [
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: <FaClipboardList />, 
      trend: '',
      trendDirection: 'up',
      subLabel: 'All time'
    },
    {
      label: 'Inventory Items',
      value: totalSKUs,
      icon: <FaBox />, 
      trend: '',
      trendDirection: 'up',
      subLabel: 'Active SKUs'
    },
    {
      label: 'Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString()}`,
      icon: <FaMoneyBillWave />, 
      trend: '',
      trendDirection: 'up',
      subLabel: 'Current stock value'
    }
  ];

  // Inventory status by category
  const categories = ['Grains', 'Vegetables', 'Fruits', 'Dairy'];
  const inventoryStatus = categories.map(category => {
    const items = inventory.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
    const stock = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const capacity = items.length > 0 ? stock * 2 : 1000;
    let status = 'critical';
    if (capacity > 0) {
      const percent = stock / capacity;
      if (percent > 0.5) status = 'healthy';
      else if (percent > 0.2) status = 'warning';
    }
    return { category, stock, capacity, status };
  });

  // Performance metrics (static for now)
  const performanceMetrics = [
    { label: 'Order Fulfillment Rate', value: '92.1%', target: '95%', status: 'warning' },
    { label: 'Customer Satisfaction', value: '4.6/5', target: '4.8/5', status: 'healthy' },
    { label: 'Inventory Turnover', value: '10.2', target: '15', status: 'critical' }
  ];

  // Market insights (static for now)
  const marketInsights = [
    { category: 'Wheat', trend: 'up', price: '₹2,800/quintal', change: '+5.2%' },
    { category: 'Rice', trend: 'down', price: '₹3,200/quintal', change: '-2.1%' },
    { category: 'Vegetables', trend: 'up', price: '₹45/kg', change: '+8.5%' },
    { category: 'Fruits', trend: 'stable', price: '₹120/kg', change: '0.0%' }
  ];

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
    return <div className="dealer-dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="dealer-dashboard">{error}</div>;
  }

  return (
    <div className="dealer-dashboard">
      <div className="dealer-header">
        <div className="header-content">
          <h1>Dealer Dashboard</h1>
        <p className="dealer-welcome-message">
            Welcome, {user?.email}!
        </p>
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
        {/* Recent Retailer Requests */}
        <div className="dashboard-card recent-orders-card">
          <h2>Recent Retailer Requests</h2>
          {retailerRequests.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="requested-items-table">
                <thead>
                  <tr>
                    <th>Retailer</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Requested Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {retailerRequests.map((req) => {
                    const pricePerUnit = req.price ? Number(String(req.price).replace(/[^\d.]/g, '')) : 0;
                    const total = pricePerUnit * Number(req.requestedQty);
                    return (
                      <tr key={req._id}>
                        <td>{req.retailerEmail}</td>
                        <td>{req.itemName}</td>
                        <td>{req.category}</td>
                        <td>{req.requestedQty} {req.unit}</td>
                        <td>{req.price || '-'}</td>
                        <td>₹{total.toLocaleString()}</td>
                        <td><span className={`requested-badge ${getStatusClass(req.status)}`}>{req.status}</span></td>
                        <td>{new Date(req.createdAt).toLocaleString()}</td>
                        <td>
                          {req.status === 'requested' && (
                            <>
                              <button className="accept-btn" onClick={() => handleRequestAction(req._id, 'accepted')}>Accept</button>
                              <button className="reject-btn" onClick={() => handleRequestAction(req._id, 'rejected')} style={{marginLeft: 8}}>Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No retailer requests yet.</div>
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
        {/* Performance Metrics */}
        <div className="dashboard-card performance-metrics">
          <h2><FaChartBar /> Performance Metrics</h2>
          <div className="metrics-list">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="metric-item">
                <div className="metric-header">
                  <span className="label">{metric.label}</span>
                  <span className={`status ${metric.status}`}>{metric.status}</span>
                </div>
                <div className="metric-value">
                  <span className="current">{metric.value}</span>
                  <span className="target">Target: {metric.target}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ 
                      width: `${(parseFloat(metric.value) / parseFloat(metric.target)) * 100}%`,
                      backgroundColor: getStatusColor(metric.status)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Market Insights */}
        <div className="dashboard-card market-insights">
          <h2><FaChartLine /> Market Insights</h2>
          <div className="insights-list">
            {marketInsights.map((insight, index) => (
              <div key={index} className="insight-item">
                <div className="insight-header">
                  <span className="category">{insight.category}</span>
                  <span className={`trend ${insight.trend}`}>
                    {insight.trend === 'up' ? <FaArrowUp /> : 
                     insight.trend === 'down' ? <FaArrowDown /> : '—'}
                  </span>
                </div>
                <div className="insight-details">
                  <span className="price">{insight.price}</span>
                  <span className={`change ${insight.trend}`}>{insight.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/dealer/inventory'}>Add items</button>
            <button className="action-btn" onClick={() => window.location.href = '/dealer/inventory'}>Manage Inventory</button>
            <button className="action-btn" onClick={() => window.location.href = '/dealer/orders'}>View Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
