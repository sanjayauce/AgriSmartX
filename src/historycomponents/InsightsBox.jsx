import React from 'react';
import { useTranslation } from 'react-i18next';
import './InsightsBox.css';

const InsightsBox = ({ filters }) => {
  const { t, i18n } = useTranslation();
  // Debug log
  console.log('InsightsBox language:', i18n.language, 'keyInsights:', t('keyInsights'));
  // Get placeholder data from translations
  const insights = t('insights.placeholder', { returnObjects: true });

  return (
    <section className="insights-box">
      <h2>{t('keyInsights') || 'Key Insights'}</h2>
      <div className="insights-grid">
        <div className="insight-card">
          <h3>{t('highestProducingYear')}</h3>
          <p className="insight-value">2015</p>
        </div>
        <div className="insight-card">
          <h3>{t('lowestYieldYear')}</h3>
          <p className="insight-value">1995</p>
        </div>
        <div className="insight-card">
          <h3>{t('averageGrowthRate')}</h3>
          <p className="insight-value">3.5%</p>
        </div>
      </div>
    </section>
  );
};

export default InsightsBox; 