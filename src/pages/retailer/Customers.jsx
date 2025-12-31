import React, { useState } from 'react';
import { FaEdit, FaEnvelope, FaFilter, FaHistory, FaMapMarkerAlt, FaPhone, FaRegStar, FaSearch, FaShoppingCart, FaSort, FaStar, FaStarHalfAlt, FaTrash, FaUserFriends, FaUserPlus } from 'react-icons/fa';
import './Customers.css';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loyaltyFilter, setLoyaltyFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sample data for customer statistics
  const customerStats = [
    {
      label: 'Total Customers',
      value: '1,234',
      trend: '+12%',
      trendDirection: 'up',
      icon: <FaUserFriends />,
      subLabel: 'Active customers'
    },
    {
      label: 'New Customers',
      value: '45',
      trend: '+8%',
      trendDirection: 'up',
      icon: <FaUserPlus />,
      subLabel: 'This month'
    },
    {
      label: 'Average Order Value',
      value: '₹850',
      trend: '+5%',
      trendDirection: 'up',
      icon: <FaShoppingCart />,
      subLabel: 'Per customer'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.8',
      trend: '+0.2',
      trendDirection: 'up',
      icon: <FaStar />,
      subLabel: 'Out of 5.0'
    }
  ];

  // Sample data for customers
  const customers = [
    {
      id: 'CUST001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      address: '123 Main Street, Mumbai, Maharashtra',
      loyaltyPoints: 1250,
      totalOrders: 45,
      lastOrder: '2024-02-15',
      averageOrderValue: '₹950',
      customerSince: '2023-01-15',
      status: 'active',
      preferences: ['Organic', 'Local Produce'],
      recentOrders: [
        { id: 'ORD001', date: '2024-02-15', amount: '₹1,200', status: 'Delivered' },
        { id: 'ORD002', date: '2024-02-01', amount: '₹850', status: 'Delivered' }
      ]
    },
    {
      id: 'CUST002',
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 87654 32109',
      address: '456 Park Avenue, Delhi, NCR',
      loyaltyPoints: 850,
      totalOrders: 28,
      lastOrder: '2024-02-10',
      averageOrderValue: '₹750',
      customerSince: '2023-03-20',
      status: 'active',
      preferences: ['Fresh Fruits', 'Vegetables'],
      recentOrders: [
        { id: 'ORD003', date: '2024-02-10', amount: '₹650', status: 'Delivered' },
        { id: 'ORD004', date: '2024-01-25', amount: '₹900', status: 'Delivered' }
      ]
    },
    {
      id: 'CUST003',
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 76543 21098',
      address: '789 Lake View, Bangalore, Karnataka',
      loyaltyPoints: 2100,
      totalOrders: 62,
      lastOrder: '2024-02-18',
      averageOrderValue: '₹1,100',
      customerSince: '2022-11-05',
      status: 'active',
      preferences: ['Premium', 'Exotic Items'],
      recentOrders: [
        { id: 'ORD005', date: '2024-02-18', amount: '₹1,500', status: 'Delivered' },
        { id: 'ORD006', date: '2024-02-05', amount: '₹950', status: 'Delivered' }
      ]
    }
  ];

  // Sample data for recent activities
  const recentActivities = [
    {
      type: 'new_customer',
      customer: 'Neha Gupta',
      time: '2 hours ago',
      details: 'New customer registration'
    },
    {
      type: 'order',
      customer: 'Rahul Sharma',
      time: '3 hours ago',
      details: 'Placed order #ORD007'
    },
    {
      type: 'loyalty',
      customer: 'Amit Kumar',
      time: '5 hours ago',
      details: 'Reached Gold tier status'
    }
  ];

  // Sample data for quick actions
  const quickActions = [
    {
      label: 'Add New Customer',
      icon: <FaUserPlus />,
      action: () => console.log('Add new customer')
    },
    {
      label: 'Import Customers',
      icon: <FaUserFriends />,
      action: () => console.log('Import customers')
    },
    {
      label: 'Export Customer Data',
      icon: <FaHistory />,
      action: () => console.log('Export customer data')
    },
    {
      label: 'Generate Report',
      icon: <FaStar />,
      action: () => console.log('Generate report')
    }
  ];

  const getLoyaltyTier = (points) => {
    if (points >= 2000) return { name: 'Gold', color: '#FFD700' };
    if (points >= 1000) return { name: 'Silver', color: '#C0C0C0' };
    return { name: 'Bronze', color: '#CD7F32' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_customer':
        return <FaUserPlus />;
      case 'order':
        return <FaShoppingCart />;
      case 'loyalty':
        return <FaStar />;
      default:
        return <FaUserFriends />;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="star half" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="star" />);
    }
    return stars;
  };

  return (
    <div className="retailer-customers">
      <div className="customers-header">
        <div className="header-content">
          <h1>Customer Management</h1>
          <p className="welcome-message">Manage your customer relationships and track their activity</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <FaUserPlus /> Add New Customer
          </button>
        </div>
      </div>

      <div className="customers-grid">
        <div className="main-content">
          <div className="customers-section">
            <div className="statistics-grid">
              {customerStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h3>{stat.label}</h3>
                    <div className="stat-value">{stat.value}</div>
                    <div className={`stat-trend ${stat.trendDirection}`}>
                      {stat.trend}
                    </div>
                    <div className="stat-sub-label">{stat.subLabel}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="filters-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filters-group">
                <div className="filter-item">
                  <FaFilter className="filter-icon" />
                  <select
                    value={loyaltyFilter}
                    onChange={(e) => setLoyaltyFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Loyalty Tiers</option>
                    <option value="gold">Gold Tier</option>
                    <option value="silver">Silver Tier</option>
                    <option value="bronze">Bronze Tier</option>
                  </select>
                </div>
                <div className="filter-item">
                  <FaSort className="sort-icon" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="filter-select"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="loyalty">Sort by Loyalty Points</option>
                    <option value="orders">Sort by Total Orders</option>
                    <option value="recent">Sort by Recent Activity</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="customers-list">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className={`customer-card ${selectedCustomer?.id === customer.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="customer-header">
                    <div className="customer-info">
                      <span className="customer-id">{customer.id}</span>
                      <span className={`customer-status ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="customer-loyalty">
                      <span
                        className="loyalty-tier"
                        style={{ color: getLoyaltyTier(customer.loyaltyPoints).color }}
                      >
                        {getLoyaltyTier(customer.loyaltyPoints).name} Tier
                      </span>
                    </div>
                  </div>

                  <div className="customer-details">
                    <div className="customer-main">
                      <h3 className="customer-name">{customer.name}</h3>
                      <div className="customer-contact">
                        <div className="contact-item">
                          <FaPhone className="contact-icon" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="contact-item">
                          <FaEnvelope className="contact-icon" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="contact-item">
                          <FaMapMarkerAlt className="contact-icon" />
                          <span>{customer.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="customer-metrics">
                      <div className="metric">
                        <span className="metric-label">Loyalty Points</span>
                        <span className="metric-value">{customer.loyaltyPoints}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Total Orders</span>
                        <span className="metric-value">{customer.totalOrders}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Avg. Order Value</span>
                        <span className="metric-value">{customer.averageOrderValue}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Customer Since</span>
                        <span className="metric-value">
                          {new Date(customer.customerSince).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="customer-preferences">
                      <h4>Preferences</h4>
                      <div className="preferences-list">
                        {customer.preferences.map((pref, index) => (
                          <span key={index} className="preference-tag">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="recent-orders">
                      <h4>Recent Orders</h4>
                      <div className="orders-list">
                        {customer.recentOrders.map((order) => (
                          <div key={order.id} className="order-item">
                            <div className="order-info">
                              <span className="order-id">{order.id}</span>
                              <span className="order-date">{order.date}</span>
                            </div>
                            <div className="order-details">
                              <span className="order-amount">{order.amount}</span>
                              <span className={`order-status ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="customer-actions">
                      <button className="action-btn view">
                        <FaHistory /> View History
                      </button>
                      <button className="action-btn edit">
                        <FaEdit /> Edit
                      </button>
                      <button className="action-btn delete">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="customers-sidebar">
          <div className="sidebar-section">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-customer">{activity.customer}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                    <p className="activity-details">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-button"
                  onClick={action.action}
                >
                  <span className="action-icon">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
