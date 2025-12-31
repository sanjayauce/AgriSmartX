import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/SeedsFertilizers.css';

const SeedsFertilizers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-seeds-fertilizers-dashboard">
      <div className="provider-seeds-fertilizers-header">
        <h1>{t('provider.seedsFertilizers', 'Seeds & Fertilizers')}</h1>
        <p className="provider-seeds-fertilizers-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-seeds-fertilizers-sections">
        <div className="provider-seeds-fertilizers-overview" style={{ width: '100%' }}>
          <h2>{t('provider.seedsFertilizers', 'Seeds & Fertilizers Overview')}</h2>
          <div className="provider-seeds-fertilizers-activity-list">
            <div className="provider-seeds-fertilizers-activity-item">
              <div className="provider-seeds-fertilizers-activity-details">
                <p>View and manage seeds and fertilizers information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedsFertilizers;
