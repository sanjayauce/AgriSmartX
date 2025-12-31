import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
  const { t, i18n } = useTranslation();
  // Debug log
  console.log('HistoryHero language:', i18n.language, 'heroTitle:', t('heroTitle'));
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSubtitle')}</p>
      </div>
    </section>
  );
};

export default Hero; 