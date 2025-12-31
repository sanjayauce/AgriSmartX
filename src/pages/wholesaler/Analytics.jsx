import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaArrowDown,
  FaArrowUp,
  FaBox,
  FaDollarSign,
  FaDownload,
  FaShoppingCart,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Analytics.css';

const Analytics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [txnRes, invRes] = await Promise.all([
          axios.get(`http://localhost:5005/api/inventory/transactions/${user.roleId}`),
          axios.get(`http://localhost:5005/api/inventory/${user.roleId}`)
        ]);
        setTransactions(txnRes.data || []);
        setInventory(invRes.data || []);
      } catch (err) {
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalOrders = transactions.length;
  const inventoryValue = inventory.reduce((sum, item) => {
    const priceNum = parseFloat((item.price || '').replace(/[^\d.]/g, '')) || 0;
    return sum + (priceNum * item.quantity);
  }, 0);
  // For customer growth, count unique dealerIds in transactions
  const uniqueDealers = new Set(transactions.map(t => t.dealerId));
  const customerGrowth = uniqueDealers.size;

  const performanceMetrics = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <FaDollarSign />,
      trend: '',
      trendDirection: 'up',
      subLabel: 'vs last period'
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: <FaShoppingCart />,
      trend: '',
      trendDirection: 'up',
      subLabel: 'vs last period'
    },
    {
      label: 'Inventory Value',
      value: `₹${inventoryValue.toLocaleString()}`,
      icon: <FaBox />,
      trend: '',
      trendDirection: 'up',
      subLabel: 'current stock'
    },
    {
      label: 'Customer Growth',
      value: `+${customerGrowth}`,
      icon: <FaUsers />,
      trend: '',
      trendDirection: 'up',
      subLabel: 'unique dealers'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <FaArrowUp className="trend-icon up" />;
    if (trend === 'down') return <FaArrowDown className="trend-icon down" />;
    return null;
  };

  const renderMetricCard = (metric) => (
    <div key={metric.label} className="metric-card">
      <div className="metric-icon">{metric.icon}</div>
      <div className="metric-content">
        <h3>{metric.label}</h3>
        <p className="metric-value">{metric.value}</p>
        <div className="metric-trend">
          <span className={`trend ${metric.trendDirection}`}>
            {getTrendIcon(metric.trendDirection)}
            {metric.trend}
          </span>
          <span className="sub-label">{metric.subLabel}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wholesaler-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h1>{t('wholesaler.analytics')}</h1>
          <p className="analytics-welcome-message">
            {t('welcome')}, {user?.email}!
          </p>
        </div>
        <div className="header-actions">
          <div className="filter-group">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="filter-select"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="grains">Grains</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
            </select>
          </div>
          <button className="primary-btn">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="metrics-grid">
        {performanceMetrics.map(metric => renderMetricCard(metric))}
      </div>

      {/* Remove analytics-grid and all static/dummy analytics cards */}
    </div>
  );
};

export default Analytics;
