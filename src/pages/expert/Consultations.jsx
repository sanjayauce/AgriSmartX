import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Consultations = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Example statistics (replace with real data)
  const stats = [
    { label: t('expert.activeConsultations'), value: '4' },
    { label: t('expert.completedConsultations'), value: '12' },
    { label: t('expert.scheduledConsultations'), value: '2' },
  ];

  // Example consultations (replace with real data)
  const consultations = [
    { farmer: 'John Farmer', topic: t('expert.soilHealth'), date: '2024-06-14', status: t('expert.active') },
    { farmer: 'Priya Grower', topic: t('expert.irrigation'), date: '2024-06-13', status: t('expert.completed') },
    { farmer: 'Ravi Sower', topic: t('expert.cropSelection'), date: '2024-06-12', status: t('expert.scheduled') },
  ];

  return (
    <div className="expert-dashboard">
      <div className="expert-header">
        <h1>{t('expert.consultations')}</h1>
        <p className="expert-welcome-message">
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
        <div className="expert-recent-activity" style={{ gridColumn: '1 / span 2' }}>
          <h2>{t('expert.recentConsultations')}</h2>
          <table className="expert-table">
            <thead>
              <tr>
                <th>{t('expert.farmerName')}</th>
                <th>{t('expert.topic')}</th>
                <th>{t('expert.date')}</th>
                <th>{t('expert.status')}</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.farmer}</td>
                  <td>{c.topic}</td>
                  <td>{c.date}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="expert-quick-actions">
          <h2>{t('expert.quickActions')}</h2>
          <div className="expert-action-buttons">
            <button className="expert-action-btn expert-primary">
              {t('expert.startConsultation')}
            </button>
            <button className="expert-action-btn">
              {t('expert.viewHistory')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultations;
