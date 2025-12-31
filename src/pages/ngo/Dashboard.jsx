import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../admin/AdminDashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>{t('ngo.dashboard', 'NGO Dashboard')}</h1>
        <p className="welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="dashboard-sections">
        <div className="recent-activity" style={{ width: '100%' }}>
          <h2>{t('ngo.dashboard', 'Overview')}</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-details">
                <p>View NGO overview and statistics here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
