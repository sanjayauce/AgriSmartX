import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [profileEntries, setProfileEntries] = useState([]);

  // Debug log
  console.log('Dashboard language:', i18n.language, 'dashboard:', t('dashboard'));

  useEffect(() => {
    loadProfileEntries();
  }, []);

  const loadProfileEntries = () => {
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('farmerProfile')) {
        try {
          const profile = JSON.parse(localStorage.getItem(key));
          entries.push({ key, ...profile });
        } catch (error) {
          console.error('Error parsing profile:', error);
        }
      }
    }
    setProfileEntries(entries);
  };

  const handleClearProfile = (profileKey) => {
    localStorage.removeItem(profileKey);
    loadProfileEntries(); // Reload the entries after deletion
  };

  const handleClearAll = () => {
    // Remove all farmer profiles from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('farmerProfile')) {
        localStorage.removeItem(key);
      }
    }
    loadProfileEntries(); // Reload the entries after clearing all
  };

  const handleCheckInsights = (profile) => {
    // Convert display names to keys
    const primaryCropKey = profile.primaryCrop ? profile.primaryCrop.toLowerCase().replace(/\s+/g, '') : '';
    const secondaryCropKey = profile.secondaryCrop ? profile.secondaryCrop.toLowerCase().replace(/\s+/g, '') : '';
    const stateKey = profile.state ? profile.state.toLowerCase().replace(/\s+/g, '') : '';
    navigate('/history', {
      state: {
        primaryCrop: primaryCropKey,
        secondaryCrop: secondaryCropKey,
        state: stateKey
      }
    });
  };

  const profileFields = [
    { key: 'name', label: t('fullName') },
    { key: 'mobileNumber', label: t('mobileNumber') },
    { key: 'country', label: t('country') },
    { key: 'state', label: t('state') },
    { key: 'district', label: t('district') },
    { key: 'mandal', label: t('mandal') },
    { key: 'primaryCrop', label: t('primaryCrop') },
    { key: 'secondaryCrop', label: t('secondaryCrop') }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{t('dashboard')}</h1>
        {profileEntries.length > 0 && (
          <button 
            className="clear-all-button"
            onClick={handleClearAll}
            title={t('clearAll')}
          >
            {t('clearAll')}
          </button>
        )}
      </div>
      <p className="welcome-message">{t('welcome')}, {t(`roles.${userRole?.toLowerCase().replace(/\s+/g, '')}`)}!</p>
      
      {profileEntries.length > 0 ? (
        <div className="profile-entries">
          {profileEntries.map((profile, index) => (
            <div key={profile.key} className="profile-entry-card">
              <div className="profile-header">
                <h2 className="profile-title">{t('profile')} {index + 1}</h2>
                <button 
                  className="clear-button"
                  onClick={() => handleClearProfile(profile.key)}
                  title={t('clearProfile')}
                >
                  -
                </button>
              </div>
              <div className="profile-grid">
                {profileFields.map(({ key, label }) => (
                  <div key={key} className="profile-card">
                    <h3>{label}</h3>
                    <p>{profile[key]}</p>
                  </div>
                ))}
              </div>
              <button className="insights-button" onClick={() => handleCheckInsights(profile)}>
                🔍 {t('checkInsights')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-profile-message">
          <p>{t('noProfileMessage')}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 