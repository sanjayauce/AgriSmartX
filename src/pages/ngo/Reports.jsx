import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Reports.css';

const Reports = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="ngo-reports-dashboard">
      <div className="ngo-reports-header">
        <h1>{t('ngo.reports', 'Reports')}</h1>
        <p className="ngo-reports-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="ngo-reports-sections">
        <div className="ngo-reports-content" style={{ width: '100%' }}>
          <h2>{t('ngo.reports', 'Reports & Analytics')}</h2>
          <div className="ngo-reports-activity-list">
            <div className="ngo-reports-activity-item">
              <div className="ngo-reports-activity-details">
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
