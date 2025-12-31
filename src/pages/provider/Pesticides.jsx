import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Pesticides.css';

const Pesticides = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-pesticides-dashboard">
      <div className="provider-pesticides-header">
        <h1>{t('provider.pesticides', 'Pesticides')}</h1>
        <p className="provider-pesticides-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-pesticides-sections">
        <div className="provider-pesticides-overview" style={{ width: '100%' }}>
          <h2>{t('provider.pesticides', 'Pesticides Overview')}</h2>
          <div className="provider-pesticides-activity-list">
            <div className="provider-pesticides-activity-item">
              <div className="provider-pesticides-activity-details">
                <p>View and manage pesticides information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pesticides;
