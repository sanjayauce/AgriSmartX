import React, { useState } from 'react';
import { FaCalendarAlt, FaChartLine, FaCloudRain, FaDownload, FaExclamationTriangle, FaFileAlt, FaLeaf, FaMapMarkedAlt, FaRupeeSign, FaSeedling, FaShare, FaTemperatureHigh, FaTractor, FaUsers, FaWarehouse, FaWater } from 'react-icons/fa';
import './Overview.css';

const Overview = () => {
  const [dateRange, setDateRange] = useState('month');
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Sample data for key metrics
  const keyMetrics = [
    {
      label: 'Total Farmers',
      value: '45,678',
      trend: '+5.2%',
      trendDirection: 'up',
      icon: <FaUsers />,
      subLabel: 'Registered farmers'
    },
    {
      label: 'Active Farms',
      value: '38,942',
      trend: '+3.8%',
      trendDirection: 'up',
      icon: <FaTractor />,
      subLabel: 'Operational farms'
    },
    {
      label: 'Total Production',
      value: '2.4M tons',
      trend: '+7.5%',
      trendDirection: 'up',
      icon: <FaWarehouse />,
      subLabel: 'Annual production'
    },
    {
      label: 'Market Value',
      value: '₹12.5B',
      trend: '+6.3%',
      trendDirection: 'up',
      icon: <FaRupeeSign />,
      subLabel: 'Total market value'
    }
  ];

  // Sample data for regional statistics
  const regionalStats = [
    {
      region: 'North Zone',
      farmers: '12,345',
      area: '45,678',
      production: '850K',
      value: '₹3.2B',
      growth: '+4.5%',
      status: 'stable'
    },
    {
      region: 'South Zone',
      farmers: '15,678',
      area: '52,345',
      production: '950K',
      value: '₹4.1B',
      growth: '+6.2%',
      status: 'growing'
    },
    {
      region: 'East Zone',
      farmers: '8,901',
      area: '34,567',
      production: '650K',
      value: '₹2.8B',
      growth: '+3.8%',
      status: 'stable'
    },
    {
      region: 'West Zone',
      farmers: '8,754',
      area: '38,901',
      production: '720K',
      value: '₹2.4B',
      growth: '+5.1%',
      status: 'growing'
    }
  ];

  // Sample data for alerts and notifications
  const alerts = [
    {
      id: 'ALT001',
      type: 'weather',
      severity: 'high',
      title: 'Heavy Rainfall Warning',
      region: 'South Zone',
      description: 'Heavy rainfall expected in the next 48 hours. Farmers advised to take necessary precautions.',
      timestamp: '2024-02-20 10:30',
      status: 'active'
    },
    {
      id: 'ALT002',
      type: 'disease',
      severity: 'medium',
      title: 'Crop Disease Alert',
      region: 'North Zone',
      description: 'Reports of fungal infection in wheat crops. Advisory issued for preventive measures.',
      timestamp: '2024-02-19 15:45',
      status: 'active'
    },
    {
      id: 'ALT003',
      type: 'market',
      severity: 'low',
      title: 'Price Fluctuation Notice',
      region: 'All Zones',
      description: 'Significant price changes in vegetable markets. Farmers advised to check current rates.',
      timestamp: '2024-02-18 09:15',
      status: 'resolved'
    }
  ];

  // Sample data for recent activities
  const recentActivities = [
    {
      type: 'subsidy',
      title: 'Subsidy Distribution',
      description: 'Agricultural equipment subsidy distributed to 500 farmers',
      timestamp: '2024-02-20 14:30',
      status: 'completed'
    },
    {
      type: 'training',
      title: 'Farmer Training Program',
      description: 'Organic farming workshop conducted in South Zone',
      timestamp: '2024-02-19 11:00',
      status: 'completed'
    },
    {
      type: 'inspection',
      title: 'Quality Inspection',
      description: 'Regular inspection of agricultural markets completed',
      timestamp: '2024-02-18 16:45',
      status: 'completed'
    }
  ];

  // Sample data for environmental indicators
  const environmentalIndicators = [
    {
      label: 'Soil Health',
      value: '78%',
      trend: '+2.5%',
      trendDirection: 'up',
      icon: <FaLeaf />,
      status: 'good'
    },
    {
      label: 'Water Resources',
      value: '65%',
      trend: '-1.2%',
      trendDirection: 'down',
      icon: <FaWater />,
      status: 'moderate'
    },
    {
      label: 'Crop Diversity',
      value: '82%',
      trend: '+3.8%',
      trendDirection: 'up',
      icon: <FaSeedling />,
      status: 'good'
    },
    {
      label: 'Climate Impact',
      value: '72%',
      trend: '-0.5%',
      trendDirection: 'down',
      icon: <FaTemperatureHigh />,
      status: 'moderate'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable':
        return 'success';
      case 'growing':
        return 'info';
      case 'declining':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'weather':
        return <FaCloudRain />;
      case 'disease':
        return <FaExclamationTriangle />;
      case 'market':
        return <FaChartLine />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  return (
    <div className="govt-overview">
      <div className="overview-header">
        <div className="header-content">
          <h1>Agricultural Overview</h1>
          <p className="welcome-message">Comprehensive dashboard for agricultural monitoring and management</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      <div className="overview-grid">
        <div className="main-content">
          <div className="overview-section">
            <div className="metrics-grid">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <div className="metric-icon">{metric.icon}</div>
                  <div className="metric-content">
                    <h3>{metric.label}</h3>
                    <div className="metric-value">{metric.value}</div>
                    <div className={`metric-trend ${metric.trendDirection}`}>
                      {metric.trend}
                    </div>
                    <div className="metric-sub-label">{metric.subLabel}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="filters-container">
              <div className="filters-group">
                <div className="filter-item">
                  <FaCalendarAlt className="filter-icon" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div className="filter-item">
                  <FaMapMarkedAlt className="filter-icon" />
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Regions</option>
                    <option value="north">North Zone</option>
                    <option value="south">South Zone</option>
                    <option value="east">East Zone</option>
                    <option value="west">West Zone</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="regional-stats">
              <h2>Regional Statistics</h2>
              <div className="stats-table">
                <table>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Farmers</th>
                      <th>Area (Hectares)</th>
                      <th>Production (Tons)</th>
                      <th>Market Value</th>
                      <th>Growth</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalStats.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.region}</td>
                        <td>{stat.farmers}</td>
                        <td>{stat.area}</td>
                        <td>{stat.production}</td>
                        <td>{stat.value}</td>
                        <td className={stat.growth.startsWith('+') ? 'positive' : 'negative'}>
                          {stat.growth}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(stat.status)}`}>
                            {stat.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="alerts-section">
              <h2>Active Alerts</h2>
              <div className="alerts-list">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`alert-card ${selectedAlert?.id === alert.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="alert-header">
                      <div className="alert-icon">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="alert-info">
                        <h3>{alert.title}</h3>
                        <span className={`severity-badge ${getAlertSeverityColor(alert.severity)}`}>
                          {alert.severity} priority
                        </span>
                      </div>
                      <div className="alert-meta">
                        <span className="alert-region">{alert.region}</span>
                        <span className="alert-time">{alert.timestamp}</span>
                      </div>
                    </div>
                    <div className="alert-content">
                      <p>{alert.description}</p>
                      <div className="alert-actions">
                        <button className="action-btn">
                          <FaFileAlt /> View Details
                        </button>
                        <button className="action-btn">
                          <FaShare /> Share Alert
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overview-sidebar">
          <div className="sidebar-section">
            <h2>Environmental Indicators</h2>
            <div className="indicators-list">
              {environmentalIndicators.map((indicator, index) => (
                <div key={index} className="indicator-card">
                  <div className="indicator-icon">{indicator.icon}</div>
                  <div className="indicator-content">
                    <h3>{indicator.label}</h3>
                    <div className="indicator-value">{indicator.value}</div>
                    <div className={`indicator-trend ${indicator.trendDirection}`}>
                      {indicator.trend}
                    </div>
                    <div className={`indicator-status ${indicator.status}`}>
                      {indicator.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-icon">
                    {activity.type === 'subsidy' ? <FaRupeeSign /> :
                     activity.type === 'training' ? <FaUsers /> :
                     <FaFileAlt />}
                  </div>
                  <div className="activity-content">
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    <div className="activity-meta">
                      <span className="activity-time">{activity.timestamp}</span>
                      <span className={`activity-status ${activity.status}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 