import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Irrigation.css';

const Irrigation = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-irrigation-dashboard">
      <div className="provider-irrigation-header">
        <h1>{t('provider.irrigation', 'Irrigation')}</h1>
        <p className="provider-irrigation-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-irrigation-sections">
        <div className="provider-irrigation-overview" style={{ width: '100%' }}>
          <h2>{t('provider.irrigation', 'Irrigation Overview')}</h2>
          <div className="provider-irrigation-activity-list">
            <div className="provider-irrigation-activity-item">
              <div className="provider-irrigation-activity-details">
                <p>View and manage irrigation information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Irrigation;
