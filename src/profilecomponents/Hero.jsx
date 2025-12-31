import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
  const { t, i18n } = useTranslation();
  // Debug log
  console.log('ProfileHero language:', i18n.language, 'farmerProfile:', t('farmerProfile'));
  return (
    <div className="profile-hero">
      <div className="profile-hero-content">
        <h1>{t('farmerProfile')}</h1>
        <p>{t('profileHeroDescription')}</p>
      </div>
    </div>
  );
};

export default Hero; 