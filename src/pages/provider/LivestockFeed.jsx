import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/LivestockFeed.css';

const LivestockFeed = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-livestock-feed-dashboard">
      <div className="provider-livestock-feed-header">
        <h1>{t('provider.livestockFeed', 'Livestock Feed')}</h1>
        <p className="provider-livestock-feed-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-livestock-feed-sections">
        <div className="provider-livestock-feed-overview" style={{ width: '100%' }}>
          <h2>{t('provider.livestockFeed', 'Livestock Feed Overview')}</h2>
          <div className="provider-livestock-feed-activity-list">
            <div className="provider-livestock-feed-activity-item">
              <div className="provider-livestock-feed-activity-details">
                <p>View and manage livestock feed information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockFeed;
