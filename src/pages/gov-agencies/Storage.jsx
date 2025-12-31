import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Storage.css';

const Storage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-storage-dashboard">
      <div className="gov-agencies-storage-header">
        <h1>{t('gov-agencies.storage', 'Storage')}</h1>
        <p className="gov-agencies-storage-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-storage-sections">
        <div className="gov-agencies-storage-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.storage', 'Storage Management')}</h2>
          <div className="gov-agencies-storage-activity-list">
            <div className="gov-agencies-storage-activity-item">
              <div className="gov-agencies-storage-activity-details">
                <p>View and manage storage facilities and inventory here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage; 