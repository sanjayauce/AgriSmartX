import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="dealer-messages-dashboard">
      <div className="dealer-messages-header">
        <h1>{t('dealer.messages', 'Dealer Messages')}</h1>
        <p className="dealer-messages-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="dealer-messages-sections">
        <div className="dealer-messages-activity" style={{ width: '100%' }}>
          <h2>{t('dealer.messages', 'Messages')}</h2>
          <div className="dealer-messages-activity-list">
            <div className="dealer-messages-activity-item">
              <div className="dealer-messages-activity-details">
                <p>View and manage your messages here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
