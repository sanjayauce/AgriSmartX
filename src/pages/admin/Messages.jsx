import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="messages-dashboard">
      <div className="messages-header">
        <h1>{t('admin.messages')}</h1>
        <p className="messages-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="messages-sections">
        <div className="messages-activity" style={{ width: '100%' }}>
          <h2>{t('adminMessages.title')}</h2>
          <div className="messages-activity-list">
            <div className="messages-activity-item">
              <div className="messages-activity-details">
                <p>Send and manage messages to all user roles from here.</p>
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
