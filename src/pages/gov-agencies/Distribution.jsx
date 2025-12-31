import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Distribution.css';

const Distribution = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-distribution-dashboard">
      <div className="gov-agencies-distribution-header">
        <h1>{t('gov-agencies.distribution', 'Distribution')}</h1>
        <p className="gov-agencies-distribution-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-distribution-sections">
        <div className="gov-agencies-distribution-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.distribution', 'Distribution Management')}</h2>
          <div className="gov-agencies-distribution-activity-list">
            <div className="gov-agencies-distribution-activity-item">
              <div className="gov-agencies-distribution-activity-details">
                <p>View and manage distribution channels and logistics here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distribution;