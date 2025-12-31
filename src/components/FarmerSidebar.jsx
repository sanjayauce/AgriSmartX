import { AccountCircle, Agriculture, BarChart, Dashboard, History, Mail } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ResourceProviderSidebar.css';

const FarmerSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navLinks = [
    { path: '/farmer/profile', label: t('sidebar.profile'), icon: <AccountCircle sx={{ mr: 1 }} /> },
    { path: '/farmer/dashboard', label: t('sidebar.dashboard'), icon: <Dashboard sx={{ mr: 1 }} /> },
    { path: '/farmer/history', label: t('sidebar.history'), icon: <History sx={{ mr: 1 }} /> },
    { path: '/farmer/reports', label: t('sidebar.reports'), icon: <BarChart sx={{ mr: 1 }} /> },
    { path: '/farmer/crop-health', label: t('cropHealth'), icon: <Agriculture sx={{ mr: 1 }} /> },
    { path: '/farmer/messages', label: t('sidebar.messages'), icon: <Mail sx={{ mr: 1 }} /> },
  ];

  return (
    <>
      <div className={`resource-provider-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="user-info">
          <h3>{t(`roles.${user.role.toLowerCase().replace(/\s+/g, '')}`)}</h3>
          <p>{user.email}</p>
        </div>
        <nav>
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => { if (window.innerWidth <= 768) onToggle(); }}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="logout-btn">
            {t('sidebar.logout')}
          </button>
        </nav>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
};

export default FarmerSidebar; 