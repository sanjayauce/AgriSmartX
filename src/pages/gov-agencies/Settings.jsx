import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-settings-dashboard">
      <div className="gov-agencies-settings-header">
        <h1>{t('gov-agencies.settings', 'Settings')}</h1>
        <p className="gov-agencies-settings-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-settings-sections">
        <div className="gov-agencies-settings-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.settings', 'Settings & Preferences')}</h2>
          <div className="gov-agencies-settings-activity-list">
            <div className="gov-agencies-settings-activity-item">
              <div className="gov-agencies-settings-activity-details">
                <p>Configure your account settings and preferences here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 