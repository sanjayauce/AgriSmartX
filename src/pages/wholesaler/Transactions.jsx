import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaCalendarAlt,
  FaChartLine,
  FaDownload,
  FaExchangeAlt,
  FaEye,
  FaFileExport,
  FaFileImport,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaPlus,
  FaPrint,
  FaSearch
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Transactions.css';

const Transactions = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [transactionType, setTransactionType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user?.roleId) return;
    setLoading(true);
    setError(null);
    const fetchTxns = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/transactions/${user.roleId}`);
        setTransactions(res.data || []);
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, [user]);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const transactionStats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      trend: '',
      trendDirection: 'up',
      subLabel: 'All time'
    },
    {
      label: 'Transaction Volume',
      value: transactions.length,
      icon: <FaExchangeAlt />,
      trend: '',
      trendDirection: 'up',
      subLabel: 'Total transactions'
    }
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: 'TRX-2024-001',
      type: 'sale',
      customer: 'Farm Fresh Market',
      amount: '₹85,000',
      date: '2024-03-15',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'INV-2024-001',
      items: [
        { name: 'Wheat', quantity: '500 kg', price: '₹2,800/quintal' },
        { name: 'Rice', quantity: '300 kg', price: '₹3,200/quintal' }
      ]
    },
    {
      id: 'TRX-2024-002',
      type: 'purchase',
      supplier: 'Organic Farms Co.',
      amount: '₹45,000',
      date: '2024-03-14',
      status: 'pending',
      paymentMethod: 'UPI',
      reference: 'PO-2024-002',
      items: [
        { name: 'Organic Vegetables', quantity: '200 kg', price: '₹225/kg' }
      ]
    },
    {
      id: 'TRX-2024-003',
      type: 'sale',
      customer: 'Green Grocers Ltd',
      amount: '₹1,25,000',
      date: '2024-03-13',
      status: 'processing',
      paymentMethod: 'Cheque',
      reference: 'INV-2024-003',
      items: [
        { name: 'Mixed Fruits', quantity: '500 kg', price: '₹250/kg' },
        { name: 'Fresh Vegetables', quantity: '300 kg', price: '₹40/kg' }
      ]
    }
  ];

  const totalAmount = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const received = transactions.filter(t => t.paymentStatus === 'done').reduce((sum, t) => sum + (t.total || 0), 0);
  const pending = transactions.filter(t => t.paymentStatus === 'due').reduce((sum, t) => sum + (t.total || 0), 0);
  const overdue = 0; // Add logic if you want to track overdue
  const paymentMethods = {};
  transactions.forEach(t => {
    if (t.paymentMethod) {
      if (!paymentMethods[t.paymentMethod]) paymentMethods[t.paymentMethod] = 0;
      paymentMethods[t.paymentMethod] += t.total || 0;
    }
  });
  const paymentSummary = {
    total: `₹${totalAmount.toLocaleString()}`,
    received: `₹${received.toLocaleString()}`,
    pending: `₹${pending.toLocaleString()}`,
    overdue: `₹${overdue.toLocaleString()}`,
    methods: Object.entries(paymentMethods).map(([method, amount]) => ({
      method,
      amount: `₹${amount.toLocaleString()}`,
      percentage: totalAmount ? Math.round((amount / totalAmount) * 100) : 0
    }))
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#4CAF50',
      pending: '#FFA726',
      processing: '#2196F3',
      failed: '#F44336',
      sale: '#4CAF50',
      purchase: '#2196F3',
      return: '#F44336',
      adjustment: '#FFA726'
    };
    return colors[status] || '#757575';
  };

  const renderTransactionCard = (transaction) => (
    <div key={transaction.id} className="transaction-card">
      <div className="transaction-header">
        <div className="transaction-info">
          <h3>{transaction.id}</h3>
          <span className={`type ${transaction.type}`}>{transaction.type}</span>
        </div>
        <span className={`status-badge ${transaction.status}`}>{transaction.status}</span>
      </div>
      <div className="transaction-details">
        <div className="detail-row">
          <span className="label">Date:</span>
          <span className="value">{transaction.date}</span>
        </div>
        <div className="detail-row">
          <span className="label">{transaction.type === 'sale' ? 'Customer:' : 'Supplier:'}</span>
          <span className="value">{transaction.type === 'sale' ? transaction.customer : transaction.supplier}</span>
        </div>
        <div className="detail-row">
          <span className="label">Amount:</span>
          <span className="value amount">{transaction.amount}</span>
        </div>
        <div className="detail-row">
          <span className="label">Payment Method:</span>
          <span className="value">{transaction.paymentMethod}</span>
        </div>
        <div className="detail-row">
          <span className="label">Reference:</span>
          <span className="value">{transaction.reference}</span>
        </div>
      </div>
      <div className="transaction-items">
        <h4>Items:</h4>
        {transaction.items.map((item, index) => (
          <div key={index} className="item-row">
            <span>{item.name}</span>
            <span>{item.quantity}</span>
            <span>{item.price}</span>
          </div>
        ))}
      </div>
      <div className="transaction-actions">
        <button className="action-btn view">
          <FaEye /> View Details
        </button>
        <button className="action-btn print">
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );

  return (
    <div className="wholesaler-transactions">
      <div className="transactions-header">
        <div className="header-content">
          <h1>{t('wholesaler.transactions')}</h1>
          <p className="transactions-welcome-message">
            {t('welcome')}, {user?.email}!
          </p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <FaPlus /> New Transaction
          </button>
          <button className="secondary-btn">
            <FaFileExport /> Export
          </button>
          <button className="secondary-btn">
            <FaFileImport /> Import
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="transactions-stats-grid">
        {transactionStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
              <div className="stat-trend">
                <span className={`trend ${stat.trendDirection}`}>
                  {stat.trend}
                </span>
                <span className="sub-label">{stat.subLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="transactions-grid">
        {/* Main Transactions Section */}
        <div className="transactions-main">
          <div className="transactions-filters">
            <div className="search-box">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
                <option value="year">Last Year</option>
              </select>
              <select 
                value={transactionType} 
                onChange={(e) => setTransactionType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="sale">Sales</option>
                <option value="purchase">Purchases</option>
                <option value="return">Returns</option>
                <option value="adjustment">Adjustments</option>
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction._id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-info">
                    <h3>{transaction.itemName}</h3>
                    <span className="type sale">sale</span>
                  </div>
                  <span className="status-badge completed">completed</span>
                </div>
                <div className="transaction-details">
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{new Date(transaction.date).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Dealer:</span>
                    <span className="value">{transaction.dealerEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Amount:</span>
                    <span className="value amount">₹{transaction.total.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Quantity:</span>
                    <span className="value">{transaction.quantity} {transaction.unit}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Price per unit:</span>
                    <span className="value">{transaction.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="transactions-sidebar">
          {/* Payment Summary */}
          <div className="sidebar-card payment-summary">
            <h2><FaMoneyBillWave /> Payment Summary</h2>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="label">Total Amount</span>
                <span className="value">{paymentSummary.total}</span>
              </div>
              <div className="summary-stat">
                <span className="label">Received</span>
                <span className="value received">{paymentSummary.received}</span>
              </div>
              <div className="summary-stat">
                <span className="label">Pending</span>
                <span className="value pending">{paymentSummary.pending}</span>
              </div>
              <div className="summary-stat">
                <span className="label">Overdue</span>
                <span className="value overdue">{paymentSummary.overdue}</span>
              </div>
            </div>
            <div className="payment-methods">
              <h3>Payment Methods</h3>
              {paymentSummary.methods.map((method, index) => (
                <div key={index} className="method-row">
                  <div className="method-info">
                    <span className="method-name">{method.method}</span>
                    <span className="method-amount">{method.amount}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ 
                        width: `${method.percentage}%`,
                        backgroundColor: getStatusColor('completed')
                      }}
                    ></div>
                  </div>
                  <span className="method-percentage">{method.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn">
                <FaCalendarAlt /> Schedule Payment
              </button>
              <button className="action-btn">
                <FaFileInvoiceDollar /> Generate Invoice
              </button>
              <button className="action-btn">
                <FaDownload /> Download Report
              </button>
              <button className="action-btn">
                <FaChartLine /> View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
