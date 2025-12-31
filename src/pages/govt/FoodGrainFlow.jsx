import React, { useState } from 'react';
import { FaArrowRight, FaChartLine, FaDownload, FaExclamationTriangle, FaFilter, FaMapMarkedAlt, FaRupeeSign, FaSearch, FaTruck, FaWarehouse, FaWeight } from 'react-icons/fa';
import './FoodGrainFlow.css';

const FoodGrainFlow = () => {
  const [dateRange, setDateRange] = useState('month');
  const [regionFilter, setRegionFilter] = useState('all');
  const [grainTypeFilter, setGrainTypeFilter] = useState('all');
  const [selectedFlow, setSelectedFlow] = useState(null);

  // Sample data for flow statistics
  const flowStats = [
    {
      label: 'Total Procurement',
      value: '2.5M tons',
      trend: '+8.2%',
      trendDirection: 'up',
      icon: <FaWeight />,
      subLabel: 'Current season'
    },
    {
      label: 'Storage Capacity',
      value: '3.2M tons',
      trend: '+5.5%',
      trendDirection: 'up',
      icon: <FaWarehouse />,
      subLabel: 'Utilization: 78%'
    },
    {
      label: 'Distribution',
      value: '1.8M tons',
      trend: '+4.3%',
      trendDirection: 'up',
      icon: <FaTruck />,
      subLabel: 'Monthly average'
    },
    {
      label: 'Market Value',
      value: '₹15.2B',
      trend: '+6.7%',
      trendDirection: 'up',
      icon: <FaRupeeSign />,
      subLabel: 'Total value'
    }
  ];

  // Sample data for flow tracking
  const flowTracking = [
    {
      id: 'FLOW001',
      grainType: 'Wheat',
      quantity: '500,000',
      source: 'North Zone',
      destination: 'Central Storage',
      status: 'in-transit',
      startDate: '2024-02-15',
      estimatedArrival: '2024-02-22',
      currentLocation: 'Transit Point 3',
      vehicleDetails: 'Truck No: MH-02-AB-1234'
    },
    {
      id: 'FLOW002',
      grainType: 'Rice',
      quantity: '350,000',
      source: 'East Zone',
      destination: 'South Distribution',
      status: 'completed',
      startDate: '2024-02-10',
      completionDate: '2024-02-18',
      vehicleDetails: 'Truck No: WB-01-CD-5678'
    },
    {
      id: 'FLOW003',
      grainType: 'Wheat',
      quantity: '450,000',
      source: 'West Zone',
      destination: 'North Distribution',
      status: 'scheduled',
      startDate: '2024-02-25',
      estimatedArrival: '2024-03-02',
      vehicleDetails: 'Truck No: GJ-03-EF-9012'
    }
  ];

  // Sample data for storage status
  const storageStatus = [
    {
      location: 'Central Storage',
      capacity: '1.2M',
      currentStock: '950K',
      utilization: '79%',
      grainTypes: ['Wheat', 'Rice', 'Pulses'],
      status: 'optimal'
    },
    {
      location: 'North Storage',
      capacity: '800K',
      currentStock: '720K',
      utilization: '90%',
      grainTypes: ['Wheat', 'Barley'],
      status: 'high'
    },
    {
      location: 'South Storage',
      capacity: '600K',
      currentStock: '450K',
      utilization: '75%',
      grainTypes: ['Rice', 'Pulses'],
      status: 'optimal'
    }
  ];

  // Sample data for alerts
  const alerts = [
    {
      id: 'ALT001',
      type: 'storage',
      severity: 'high',
      title: 'Storage Capacity Alert',
      location: 'North Storage',
      description: 'Storage utilization reaching 90%. Consider redistribution.',
      timestamp: '2024-02-20 09:30'
    },
    {
      id: 'ALT002',
      type: 'transport',
      severity: 'medium',
      title: 'Transport Delay',
      location: 'Transit Point 3',
      description: 'Transport FLOW001 delayed due to weather conditions.',
      timestamp: '2024-02-19 15:45'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'success';
      case 'high':
        return 'warning';
      case 'critical':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getFlowStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-transit':
        return 'info';
      case 'scheduled':
        return 'warning';
      case 'delayed':
        return 'danger';
      default:
        return 'info';
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
        return 'info';
    }
  };

  return (
    <div className="food-grain-flow">
      <div className="flow-header">
        <div className="header-content">
          <h1>Food Grain Flow Management</h1>
          <p className="welcome-message">Monitor and manage the flow of food grains across the supply chain</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <FaChartLine /> Generate Report
          </button>
        </div>
      </div>

      <div className="flow-grid">
        <div className="main-content">
          {/* Statistics Grid */}
          <div className="metrics-grid">
            {flowStats.map((stat, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">{stat.icon}</div>
                <div className="metric-content">
                  <h3>{stat.label}</h3>
                  <div className="metric-value">{stat.value}</div>
                  <div className={`metric-trend ${stat.trendDirection}`}>
                    {stat.trend}
                  </div>
                  <div className="metric-sub-label">{stat.subLabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="filters-container">
            <div className="filters-group">
              <div className="filter-item">
                <FaFilter className="filter-icon" />
                <select 
                  className="filter-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
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
                  className="filter-select"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  <option value="north">North Zone</option>
                  <option value="south">South Zone</option>
                  <option value="east">East Zone</option>
                  <option value="west">West Zone</option>
                </select>
              </div>
              <div className="filter-item">
                <FaSearch className="filter-icon" />
                <select 
                  className="filter-select"
                  value={grainTypeFilter}
                  onChange={(e) => setGrainTypeFilter(e.target.value)}
                >
                  <option value="all">All Grains</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="pulses">Pulses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flow Tracking */}
          <div className="flow-tracking">
            <h2>Flow Tracking</h2>
            <div className="flow-list">
              {flowTracking.map((flow) => (
                <div 
                  key={flow.id}
                  className={`flow-card ${selectedFlow?.id === flow.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFlow(flow)}
                >
                  <div className="flow-header">
                    <div className="flow-info">
                      <h3>{flow.grainType} - {flow.quantity} tons</h3>
                      <span className={`status-badge ${getFlowStatusColor(flow.status)}`}>
                        {flow.status}
                      </span>
                    </div>
                    <div className="flow-meta">
                      <span className="flow-id">{flow.id}</span>
                      <span className="flow-date">{flow.startDate}</span>
                    </div>
                  </div>
                  <div className="flow-content">
                    <div className="flow-route">
                      <div className="route-point source">
                        <FaWarehouse />
                        <span>{flow.source}</span>
                      </div>
                      <div className="route-arrow">
                        <FaArrowRight />
                      </div>
                      <div className="route-point destination">
                        <FaWarehouse />
                        <span>{flow.destination}</span>
                      </div>
                    </div>
                    <div className="flow-details">
                      <p><strong>Vehicle:</strong> {flow.vehicleDetails}</p>
                      {flow.status === 'in-transit' && (
                        <p><strong>Current Location:</strong> {flow.currentLocation}</p>
                      )}
                      {flow.status === 'scheduled' && (
                        <p><strong>Estimated Arrival:</strong> {flow.estimatedArrival}</p>
                      )}
                      {flow.status === 'completed' && (
                        <p><strong>Completion Date:</strong> {flow.completionDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Status */}
          <div className="storage-status">
            <h2>Storage Status</h2>
            <div className="storage-grid">
              {storageStatus.map((storage, index) => (
                <div key={index} className="storage-card">
                  <div className="storage-header">
                    <h3>{storage.location}</h3>
                    <span className={`status-badge ${getStatusColor(storage.status)}`}>
                      {storage.status}
                    </span>
                  </div>
                  <div className="storage-content">
                    <div className="storage-metrics">
                      <div className="metric">
                        <label>Capacity</label>
                        <span>{storage.capacity} tons</span>
                      </div>
                      <div className="metric">
                        <label>Current Stock</label>
                        <span>{storage.currentStock} tons</span>
                      </div>
                      <div className="metric">
                        <label>Utilization</label>
                        <span>{storage.utilization}</span>
                      </div>
                    </div>
                    <div className="storage-grains">
                      <label>Grain Types:</label>
                      <div className="grain-tags">
                        {storage.grainTypes.map((grain, idx) => (
                          <span key={idx} className="grain-tag">{grain}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flow-sidebar">
          {/* Active Alerts */}
          <div className="sidebar-section">
            <h2>Active Alerts</h2>
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className="alert-card">
                  <div className="alert-header">
                    <FaExclamationTriangle className="alert-icon" />
                    <div className="alert-info">
                      <h3>{alert.title}</h3>
                      <span className={`severity-badge ${getAlertSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                  <div className="alert-content">
                    <p>{alert.description}</p>
                    <div className="alert-meta">
                      <span className="alert-location">{alert.location}</span>
                      <span className="alert-time">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">
                <FaDownload /> Download Flow Report
              </button>
              <button className="action-btn">
                <FaChartLine /> View Analytics
              </button>
              <button className="action-btn">
                <FaMapMarkedAlt /> View Flow Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodGrainFlow; 