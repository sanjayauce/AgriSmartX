import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Financial.css';

const Financial = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-financial-dashboard">
      <div className="provider-financial-header">
        <h1>{t('provider.financial', 'Financial')}</h1>
        <p className="provider-financial-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-financial-sections">
        <div className="provider-financial-overview" style={{ width: '100%' }}>
          <h2>{t('provider.financial', 'Financial Overview')}</h2>
          <div className="provider-financial-activity-list">
            <div className="provider-financial-activity-item">
              <div className="provider-financial-activity-details">
                <p>View and manage financial information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;
