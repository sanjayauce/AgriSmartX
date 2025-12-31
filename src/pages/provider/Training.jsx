import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Training.css';

const Training = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-training-dashboard">
      <div className="provider-training-header">
        <h1>{t('provider.training', 'Training')}</h1>
        <p className="provider-training-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-training-sections">
        <div className="provider-training-overview" style={{ width: '100%' }}>
          <h2>{t('provider.training', 'Training Overview')}</h2>
          <div className="provider-training-activity-list">
            <div className="provider-training-activity-item">
              <div className="provider-training-activity-details">
                <p>View and manage training information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
