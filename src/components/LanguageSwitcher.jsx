import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', key: 'language.english' },
    { code: 'hi', key: 'language.hindi' },
    { code: 'te', key: 'language.telugu' }
  ];

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
  };

  // Debug log
  console.log('LanguageSwitcher current language:', i18n.language);

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="language-select"
        aria-label={t('language.select')}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {t(lang.key)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher; 