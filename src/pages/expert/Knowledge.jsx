import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Knowledge.css';

const Knowledge = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Example statistics (replace with real data)
  const stats = [
    { label: t('expert.articlesShared'), value: '10' },
    { label: t('expert.resources'), value: '7' },
    { label: t('expert.downloads'), value: '120' },
  ];

  // Example knowledge articles (replace with real data)
  const articles = [
    { title: 'Best Practices for Soil Health', category: t('expert.soilHealth'), date: '2024-06-01', downloads: 45 },
    { title: 'Efficient Irrigation Methods', category: t('expert.irrigation'), date: '2024-05-20', downloads: 30 },
    { title: 'Choosing the Right Crop', category: t('expert.cropSelection'), date: '2024-05-10', downloads: 25 },
  ];

  return (
    <div className="expert-knowledge-dashboard">
      <div className="expert-knowledge-header">
        <h1>{t('expert.knowledge')}</h1>
        <p className="expert-knowledge-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="expert-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="expert-stat-card">
            <h3>{stat.label}</h3>
            <p className="expert-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="expert-sections">
        <div className="expert-knowledge-activity" style={{ gridColumn: '1 / span 2' }}>
          <h2>{t('expert.knowledgeSharing')}</h2>
          <table className="expert-table">
            <thead>
              <tr>
                <th>{t('expert.title')}</th>
                <th>{t('expert.category')}</th>
                <th>{t('expert.date')}</th>
                <th>{t('expert.downloads')}</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.title}</td>
                  <td>{a.category}</td>
                  <td>{a.date}</td>
                  <td>{a.downloads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="expert-quick-actions">
          <h2>{t('expert.quickActions')}</h2>
          <div className="expert-action-buttons">
            <button className="expert-action-btn expert-primary">
              {t('expert.shareArticle')}
            </button>
            <button className="expert-action-btn">
              {t('expert.viewAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
