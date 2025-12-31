import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Policy.css';

const Policy = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-policy-dashboard">
      <div className="gov-agencies-policy-header">
        <h1>{t('gov-agencies.policy', 'Policy')}</h1>
        <p className="gov-agencies-policy-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-policy-sections">
        <div className="gov-agencies-policy-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.policy', 'Policy Management')}</h2>
          <div className="gov-agencies-policy-activity-list">
            <div className="gov-agencies-policy-activity-item">
              <div className="gov-agencies-policy-activity-details">
                <p>View and manage agricultural policies and regulations here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy; 