import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    { label: t('admin.totalUsers'), value: '1,234' },
    { label: t('admin.activeUsers'), value: '890' },
    { label: t('admin.totalResources'), value: '567' },
    { label: t('admin.systemHealth'), value: '98%' },
  ];

  const recentActivities = [
    { type: 'user', action: 'New user registration', time: '2 minutes ago' },
    { type: 'resource', action: 'Resource provider added', time: '15 minutes ago' },
    { type: 'system', action: 'System update completed', time: '1 hour ago' },
  ];

  return (
    <div className="dashboard-dashboard">
      <div className="dashboard-header">
        <h1>{t('admin.dashboard')}</h1>
        <p className="dashboard-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="dashboard-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card">
            <h3>{stat.label}</h3>
            <p className="dashboard-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="dashboard-sections">
        <div className="dashboard-recent-activity">
          <h2>{t('admin.recentActivity')}</h2>
          <div className="dashboard-activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="dashboard-activity-item">
                <span className={`dashboard-activity-type ${activity.type}`}></span>
                <div className="dashboard-activity-details">
                  <p>{activity.action}</p>
                  <small>{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-quick-actions">
          <h2>{t('admin.quickActions')}</h2>
          <div className="dashboard-action-buttons">
            <button className="dashboard-action-btn dashboard-primary">
              {t('admin.manageUsers')}
            </button>
            <button className="dashboard-action-btn">
              {t('admin.viewLogs')}
            </button>
            <button className="dashboard-action-btn">
              {t('admin.generateReport')}
            </button>
            <button className="dashboard-action-btn">
              {t('admin.systemSettings')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
