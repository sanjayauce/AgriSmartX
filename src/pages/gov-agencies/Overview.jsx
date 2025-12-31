import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Overview.css';

const Overview = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-overview-dashboard">
      <div className="gov-agencies-overview-header">
        <h1>{t('gov-agencies.overview', 'Overview')}</h1>
        <p className="gov-agencies-overview-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-overview-sections">
        <div className="gov-agencies-overview-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.overview', 'Government Agencies Overview')}</h2>
          <div className="gov-agencies-overview-activity-list">
            <div className="gov-agencies-overview-activity-item">
              <div className="gov-agencies-overview-activity-details">
                <p>View and manage government agency information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 