import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="ngo-messages-dashboard">
      <div className="ngo-messages-header">
        <h1>{t('ngo.messages', 'Messages')}</h1>
        <p className="ngo-messages-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="ngo-messages-sections">
        <div className="ngo-messages-content" style={{ width: '100%' }}>
          <h2>{t('ngo.messages', 'NGO Messages')}</h2>
          <div className="ngo-messages-activity-list">
            <div className="ngo-messages-activity-item">
              <div className="ngo-messages-activity-details">
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
