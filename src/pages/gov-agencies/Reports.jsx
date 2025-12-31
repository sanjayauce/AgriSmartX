import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Reports.css';

const Reports = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="gov-agencies-reports-dashboard">
      <div className="gov-agencies-reports-header">
        <h1>{t('gov-agencies.reports', 'Reports')}</h1>
        <p className="gov-agencies-reports-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="gov-agencies-reports-sections">
        <div className="gov-agencies-reports-content" style={{ width: '100%' }}>
          <h2>{t('gov-agencies.reports', 'Reports & Analytics')}</h2>
          <div className="gov-agencies-reports-activity-list">
            <div className="gov-agencies-reports-activity-item">
              <div className="gov-agencies-reports-activity-details">
                <p>Access and generate comprehensive reports and analytics here.</p>
                <small>Feature coming soon...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 