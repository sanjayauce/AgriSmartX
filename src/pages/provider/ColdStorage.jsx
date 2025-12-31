import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './ColdStorage.css';

const ColdStorage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-coldstorage-dashboard">
      <div className="provider-coldstorage-header">
        <h1>{t('provider.coldStorage', 'Cold Storage')}</h1>
        <p className="provider-coldstorage-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-coldstorage-sections">
        <div className="provider-coldstorage-activity" style={{ width: '100%' }}>
          <h2>{t('provider.coldStorage', 'Cold Storage Overview')}</h2>
          <div className="provider-coldstorage-activity-list">
            <div className="provider-coldstorage-activity-item">
              <div className="provider-coldstorage-activity-details">
                <p>View and manage cold storage information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdStorage;
