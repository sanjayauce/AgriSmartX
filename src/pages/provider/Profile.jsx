import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../provider/Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="provider-profile-dashboard">
      <div className="provider-profile-header">
        <h1>{t('provider.profile', 'Profile')}</h1>
        <p className="provider-profile-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-profile-sections">
        <div className="provider-profile-overview" style={{ width: '100%' }}>
          <h2>{t('provider.profile', 'Profile Overview')}</h2>
          <div className="provider-profile-activity-list">
            <div className="provider-profile-activity-item">
              <div className="provider-profile-activity-details">
                <p>View and manage your profile information here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
