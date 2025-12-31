import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Equipment.css';

const Equipment = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-equipment-dashboard">
      <div className="provider-equipment-header">
        <h1>{t('provider.equipment', 'Equipment')}</h1>
        <p className="provider-equipment-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-equipment-sections">
        <div className="provider-equipment-activity" style={{ width: '100%' }}>
          <h2>{t('provider.equipment', 'Equipment Overview')}</h2>
          <div className="provider-equipment-activity-list">
            <div className="provider-equipment-activity-item">
              <div className="provider-equipment-activity-details">
                <p>View and manage equipment information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
