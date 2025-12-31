import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Government.css';

const Government = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-government-dashboard">
      <div className="provider-government-header">
        <h1>{t('provider.government', 'Government')}</h1>
        <p className="provider-government-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-government-sections">
        <div className="provider-government-overview" style={{ width: '100%' }}>
          <h2>{t('provider.government', 'Government Overview')}</h2>
          <div className="provider-government-activity-list">
            <div className="provider-government-activity-item">
              <div className="provider-government-activity-details">
                <p>View and manage government information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Government;
