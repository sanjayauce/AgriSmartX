import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Volunteers.css';

const Volunteers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="ngo-volunteers-dashboard">
      <div className="ngo-volunteers-header">
        <h1>{t('ngo.volunteers', 'Volunteers')}</h1>
        <p className="ngo-volunteers-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="ngo-volunteers-sections">
        <div className="ngo-volunteers-content" style={{ width: '100%' }}>
          <h2>{t('ngo.volunteers', 'Volunteer Management')}</h2>
          <div className="ngo-volunteers-activity-list">
            <div className="ngo-volunteers-activity-item">
              <div className="ngo-volunteers-activity-details">
                <p>Manage and coordinate your volunteers here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
