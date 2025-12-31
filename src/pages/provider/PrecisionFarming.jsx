import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/PrecisionFarming.css';

const PrecisionFarming = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-precision-farming-dashboard">
      <div className="provider-precision-farming-header">
        <h1>{t('provider.precisionFarming', 'Precision Farming')}</h1>
        <p className="provider-precision-farming-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-precision-farming-sections">
        <div className="provider-precision-farming-overview" style={{ width: '100%' }}>
          <h2>{t('provider.precisionFarming', 'Precision Farming Overview')}</h2>
          <div className="provider-precision-farming-activity-list">
            <div className="provider-precision-farming-activity-item">
              <div className="provider-precision-farming-activity-details">
                <p>View and manage precision farming information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionFarming;
