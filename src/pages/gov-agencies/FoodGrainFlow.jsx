import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './FoodGrainFlow.css';

const FoodGrainFlow = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-foodgrainflow-dashboard">
      <div className="gov-agencies-foodgrainflow-header">
        <h1>{t('gov-agencies.foodgrainflow', 'Food Grain Flow')}</h1>
        <p className="gov-agencies-foodgrainflow-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-foodgrainflow-sections">
        <div className="gov-agencies-foodgrainflow-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.foodgrainflow', 'Food Grain Flow Management')}</h2>
          <div className="gov-agencies-foodgrainflow-activity-list">
            <div className="gov-agencies-foodgrainflow-activity-item">
              <div className="gov-agencies-foodgrainflow-activity-details">
                <p>Monitor and manage the flow of food grains here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodGrainFlow; 