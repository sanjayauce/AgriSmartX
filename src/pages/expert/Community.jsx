import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Community.css';

const Community = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Example statistics (replace with real data)
  const stats = [
    { label: t('expert.posts'), value: '15' },
    { label: t('expert.answers'), value: '42' },
    { label: t('expert.followers'), value: '120' },
  ];

  // Example community posts (replace with real data)
  const posts = [
    { question: 'How to improve soil fertility?', postedBy: 'Farmer A', date: '2024-06-10', answers: 5 },
    { question: 'Best irrigation methods for summer?', postedBy: 'Farmer B', date: '2024-06-08', answers: 3 },
    { question: 'Which crop is best for my region?', postedBy: 'Farmer C', date: '2024-06-05', answers: 7 },
  ];

  return (
    <div className="expert-community-dashboard">
      <div className="expert-community-header">
        <h1>{t('expert.community')}</h1>
        <p className="expert-community-welcome-message">
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
        <div className="expert-community-activity" style={{ gridColumn: '1 / span 2' }}>
          <h2>{t('expert.communityDiscussions')}</h2>
          <table className="expert-table">
            <thead>
              <tr>
                <th>{t('expert.question')}</th>
                <th>{t('expert.postedBy')}</th>
                <th>{t('expert.date')}</th>
                <th>{t('expert.answers')}</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.question}</td>
                  <td>{p.postedBy}</td>
                  <td>{p.date}</td>
                  <td>{p.answers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="expert-quick-actions">
          <h2>{t('expert.quickActions')}</h2>
          <div className="expert-action-buttons">
            <button className="expert-action-btn expert-primary">
              {t('expert.askQuestion')}
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

export default Community;
