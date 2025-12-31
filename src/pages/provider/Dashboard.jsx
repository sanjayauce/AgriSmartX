import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-dashboard">
      <div className="provider-header">
        <h1>{t('provider.dashboard', 'Provider Dashboard')}</h1>
        <p className="provider-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-sections">
        <div className="provider-activity" style={{ width: '100%' }}>
          <h2>{t('provider.dashboard', 'Overview')}</h2>
          <div className="provider-activity-list">
            <div className="provider-activity-item">
              <div className="provider-activity-details">
                <p>View provider overview and statistics here.</p>
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
