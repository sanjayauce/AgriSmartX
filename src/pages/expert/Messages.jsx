import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="expert-messages-dashboard">
      <div className="expert-messages-header">
        <h1>{t('expert.messages', 'Expert Messages')}</h1>
        <p className="expert-messages-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="expert-messages-sections">
        <div className="expert-messages-activity" style={{ width: '100%' }}>
          <h2>{t('expert.messages', 'Messages')}</h2>
          <div className="expert-messages-activity-list">
            <div className="expert-messages-activity-item">
              <div className="expert-messages-activity-details">
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
