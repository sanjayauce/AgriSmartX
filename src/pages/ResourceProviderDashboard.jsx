import React from 'react';
import { useTranslation } from 'react-i18next';

const ResourceProviderDashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-container">
      <h1>{t('dashboard')}</h1>
      <p>{t('resourceProviderWelcome')}</p>
      {/* Add more resource provider-specific content here */}
    </div>
  );
};

export default ResourceProviderDashboard; 