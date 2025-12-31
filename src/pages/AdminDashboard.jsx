import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Real-time stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    systemHealth: 100,
    errorLogs: 0,
    warningLogs: 0,
    totalLogs: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch user stats
      const userRes = await fetch('http://localhost:5005/api/admin/users/stats');
      const userStats = await userRes.json();
      // Fetch log stats
      const logRes = await fetch('http://localhost:5005/api/admin/logs/stats');
      const logStats = await logRes.json();
      setStats({
        totalUsers: userStats.totalUsers || 0,
        activeUsers: userStats.usersByRole?.find(r => r._id === 'Farmer')?.count || 0, // Example: active users as Farmers
        totalResources: userStats.usersByRole?.reduce((acc, r) => acc + (r.count || 0), 0) || 0,
        systemHealth: logStats.systemHealth || 100,
        errorLogs: logStats.errorLogs || 0,
        warningLogs: logStats.warningLogs || 0,
        totalLogs: logStats.totalLogs || 0
      });
    } catch (err) {
      // fallback to zeros
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalResources: 0,
        systemHealth: 100,
        errorLogs: 0,
        warningLogs: 0,
        totalLogs: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: t('admin.totalUsers'), value: stats.totalUsers },
    { label: t('admin.activeUsers'), value: stats.activeUsers },
    { label: t('admin.totalResources'), value: stats.totalResources },
    { label: t('admin.systemHealth'), value: `${stats.systemHealth}%` },
  ];

  const recentActivities = [
    { type: 'user', action: 'New user registration', time: '2 minutes ago' },
    { type: 'resource', action: 'Resource provider added', time: '15 minutes ago' },
    { type: 'system', action: 'System update completed', time: '1 hour ago' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>{t('admin.dashboard')}</h1>
        <p className="welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.label}</h3>
            <p className="stat-value">{loading ? '...' : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="recent-activity">
          <h2>{t('admin.recentActivity')}</h2>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className={`activity-type ${activity.type}`}></span>
                <div className="activity-details">
                  <p>{activity.action}</p>
                  <small>{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>{t('admin.quickActions')}</h2>
          <div className="action-buttons">
            <button className="action-btn primary">
              {t('admin.manageUsers')}
            </button>
            <button className="action-btn">
              {t('admin.viewLogs')}
            </button>
            <button className="action-btn">
              {t('admin.generateReport')}
            </button>
            <button className="action-btn">
              {t('admin.systemSettings')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 