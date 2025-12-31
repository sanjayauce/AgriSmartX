import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Logistics.css';

const Logistics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-logistics-dashboard">
      <div className="provider-logistics-header">
        <h1>{t('provider.logistics', 'Logistics')}</h1>
        <p className="provider-logistics-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-logistics-sections">
        <div className="provider-logistics-overview" style={{ width: '100%' }}>
          <h2>{t('provider.logistics', 'Logistics Overview')}</h2>
          <div className="provider-logistics-activity-list">
            <div className="provider-logistics-activity-item">
              <div className="provider-logistics-activity-details">
                <p>View and manage logistics information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
