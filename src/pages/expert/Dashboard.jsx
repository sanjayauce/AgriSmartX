import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    { label: t('expert.consultations'), value: '8' },
    { label: t('expert.researchProjects'), value: '3' },
    { label: t('expert.communityPosts'), value: '24' },
  ];

  const recentActivities = [
    { type: 'consultation', action: t('expert.consultationWith', { name: 'Farmer A' }), time: '10 minutes ago' },
    { type: 'research', action: t('expert.publishedResearch', { topic: t('expert.soilHealth') }), time: '1 hour ago' },
    { type: 'community', action: t('expert.answeredCommunity'), time: '2 hours ago' },
  ];

  return (
    <div className="expert-dashboard">
      <div className="expert-header">
        <h1>{t('expert.dashboard')}</h1>
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
        <div className="expert-recent-activity">
          <h2>{t('expert.recentActivity')}</h2>
          <div className="expert-activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className={`expert-activity-item ${activity.type}`}> 
                <span className={`expert-activity-type ${activity.type}`}></span>
                <div className="expert-activity-details">
                  <p>{activity.action}</p>
                  <small>{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="expert-quick-actions">
          <h2>{t('expert.quickActions')}</h2>
          <div className="expert-action-buttons">
            <button className="expert-action-btn expert-primary">
              {t('expert.startConsultation')}
            </button>
            <button className="expert-action-btn">
              {t('expert.addResearch')}
            </button>
            <button className="expert-action-btn">
              {t('expert.joinCommunity')}
            </button>
            <button className="expert-action-btn">
              {t('expert.shareKnowledge')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
