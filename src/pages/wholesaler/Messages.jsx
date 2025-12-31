import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="wholesaler-messages-dashboard">
      <div className="wholesaler-messages-header">
        <h1>{t('wholesaler.messages', 'Wholesaler Messages')}</h1>
        <p className="wholesaler-messages-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="wholesaler-messages-sections">
        <div className="wholesaler-messages-activity" style={{ width: '100%' }}>
          <h2>{t('wholesaler.messages', 'Messages')}</h2>
          <div className="wholesaler-messages-activity-list">
            <div className="wholesaler-messages-activity-item">
              <div className="wholesaler-messages-activity-details">
                <p>View and manage wholesaler messages here.</p>
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
