import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Research.css';

const Research = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Example statistics (replace with real data)
  const stats = [
    { label: t('expert.activeResearch'), value: '2' },
    { label: t('expert.completedResearch'), value: '5' },
    { label: t('expert.publishedResearch'), value: '3' },
  ];

  // Example research projects (replace with real data)
  const projects = [
    { title: 'Soil Microbes Study', topic: t('expert.soilHealth'), date: '2024-05-10', status: t('expert.active') },
    { title: 'Drip Irrigation Impact', topic: t('expert.irrigation'), date: '2024-04-22', status: t('expert.completed') },
    { title: 'Crop Rotation Benefits', topic: t('expert.cropSelection'), date: '2024-03-15', status: t('expert.published') },
  ];

  return (
    <div className="expert-research-dashboard">
      <div className="expert-research-header">
        <h1>{t('expert.research')}</h1>
        <p className="expert-research-welcome-message">
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
        <div className="expert-research-activity" style={{ gridColumn: '1 / span 2' }}>
          <h2>{t('expert.researchProjects')}</h2>
          <table className="expert-table">
            <thead>
              <tr>
                <th>{t('expert.title')}</th>
                <th>{t('expert.topic')}</th>
                <th>{t('expert.date')}</th>
                <th>{t('expert.status')}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.title}</td>
                  <td>{p.topic}</td>
                  <td>{p.date}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="expert-quick-actions">
          <h2>{t('expert.quickActions')}</h2>
          <div className="expert-action-buttons">
            <button className="expert-action-btn expert-primary">
              {t('expert.addResearch')}
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

export default Research;
