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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dealerRequests, setDealerRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [invRes, ordRes] = await Promise.all([
          axios.get(`http://localhost:5005/api/inventory/${user.roleId}`),
          axios.get(`http://localhost:5005/api/inventory/orders/${user.roleId}`)
        ]);
        setInventory(invRes.data);
        setOrders(ordRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user?.roleId) return;
    const fetchDealerRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/dealer-requests/wholesaler/${user.roleId}`);
        setDealerRequests(res.data || []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchDealerRequests();
  }, [user]);

  const handleRequestAction = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5005/api/inventory/dealer-requests/${id}`, { status });
      // Refetch all requests to ensure UI is in sync
      const res = await axios.get(`http://localhost:5005/api/inventory/dealer-requests/wholesaler/${user.roleId}`);
      setDealerRequests(res.data || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handlePaymentStatus = async (txnId, paymentStatus) => {
    try {
      await axios.patch(`http://localhost:5005/api/inventory/transactions/${txnId}`, { paymentStatus });
      // Optionally refetch transactions or update UI
    } catch (err) {
      // Optionally handle error
    }
  };

  // Calculate stats
  const totalSKUs = inventory.length;
  const totalOrders = dealerRequests.length;
  const totalInventoryValue = inventory.reduce((sum, item) => {
    // Try to extract numeric value from price string (e.g., '₹100/kg')
    const priceNum = parseFloat((item.price || '').replace(/[^\d.]/g, '')) || 0;
    return sum + (priceNum * item.quantity);
  }, 0);

  // Inventory status by category
  const categories = ['Grains', 'Vegetables', 'Fruits', 'Dairy'];
  const inventoryStatus = categories.map(category => {
    const items = inventory.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
    const stock = items.reduce((sum, item) => sum + item.quantity, 0);
    // For demo, set capacity as 2x stock or 1000 if no items
    const capacity = items.length > 0 ? stock * 2 : 1000;
    // Status: healthy if >50% capacity, warning if 20-50%, critical if <20%
    let status = 'critical';
    if (capacity > 0) {
      const percent = stock / capacity;
      if (percent > 0.5) status = 'healthy';
      else if (percent > 0.2) status = 'warning';
    }
    return { category, stock, capacity, status };
  });

  // Recent orders (show up to 3)
  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.orderId,
    customer: order.customer,
    items: order.items.map(i => i.name).join(', '),
    amount: `₹${order.amount.toLocaleString()}`,
    status: order.status,
    date: new Date(order.date).toISOString().slice(0, 10),
    priority: order.priority
  }));

  // Stats for cards
  const stats = [
    {
      label: t('wholesaler.totalOrders'),
      value: totalOrders,
      icon: <FaClipboardList />, // You can add trends if you want
      trend: '',
      trendDirection: 'up',
      subLabel: 'All time'
    },
    {
      label: t('wholesaler.inventoryItems'),
      value: totalSKUs,
      icon: <FaBox />, // You can add trends if you want
      trend: '',
      trendDirection: 'up',
      subLabel: 'Active SKUs'
    },
    {
      label: t('wholesaler.revenue'),
      value: `₹${orders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}`,
      icon: <FaMoneyBillWave />, // You can add trends if you want
      trend: '',
      trendDirection: 'up',
      subLabel: 'Total revenue'
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    { label: 'Order Fulfillment Rate', value: '94.5%', target: '95%', status: 'warning' },
    { label: 'Customer Satisfaction', value: '4.7/5', target: '4.8/5', status: 'healthy' },
    { label: 'Inventory Turnover', value: '12.3', target: '15', status: 'critical' }
  ];

  // Market insights
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
      processing: '#2196F3',
      pending: '#FFA726',
      completed: '#4CAF50',
      scheduled: '#2196F3',
      preparing: '#FFA726',
      accepted: '#4CAF50',
      rejected: '#F44336'
    };
    return colors[status] || '#757575';
  };

  if (loading) {
    return <div className="wholesaler-dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="wholesaler-dashboard">{error}</div>;
  }

  return (
    <div className="wholesaler-dashboard">
      <div className="wholesaler-header">
        <div className="header-content">
          <h1>{t('wholesaler.dashboard')}</h1>
          <p className="wholesaler-welcome-message">
            {t('welcome')}, {user?.email}!
          </p>
        </div>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''} 
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''} 
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Main Statistics */}
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
        {/* Recent Orders - as a dashboard card */}
        <div className="dashboard-card recent-orders-card">
          <h2>Recent Orders</h2>
          {dealerRequests.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="requested-items-table">
                <thead>
                  <tr>
                    <th>Dealer</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Requested Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dealerRequests.map((req) => {
                    const pricePerUnit = req.price ? Number(String(req.price).replace(/[^\d.]/g, '')) : 0;
                    const total = pricePerUnit * Number(req.requestedQty);
                    return (
                      <tr key={req._id}>
                        <td>{req.dealerEmail}</td>
                        <td>{req.itemName}</td>
                        <td>{req.category}</td>
                        <td>{req.requestedQty} {req.unit}</td>
                        <td>{req.price || '-'}</td>
                        <td>₹{total.toLocaleString()}</td>
                        <td><span className={`requested-badge ${req.status}`}>{req.status}</span></td>
                        <td>{new Date(req.createdAt).toLocaleString()}</td>
                        <td>
                          <span className={`payment-badge ${req.paymentStatus}`}>{req.paymentStatus}</span>
                          <button onClick={() => handlePaymentStatus(req._id, 'done')} disabled={req.paymentStatus === 'done'}>Done</button>
                          <button onClick={() => handlePaymentStatus(req._id, 'due')} disabled={req.paymentStatus === 'due'}>Due</button>
                        </td>
                        <td>
                          <button
                            className="accept-btn"
                            disabled={req.status !== 'requested'}
                            onClick={() => handleRequestAction(req._id, 'accepted')}
                          >Accept</button>
                          <button
                            className="reject-btn"
                            disabled={req.status !== 'requested'}
                            onClick={() => handleRequestAction(req._id, 'rejected')}
                            style={{marginLeft: 8}}
                          >Reject</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No recent orders.</div>
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
            <button className="action-btn" onClick={() => navigate('/wholesaler/inventory')}>Add items</button>
            <button className="action-btn" onClick={() => navigate('/wholesaler/inventory')}>Manage Inventory</button>
            <button className="action-btn" onClick={() => navigate('/wholesaler/analytics')}>View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
