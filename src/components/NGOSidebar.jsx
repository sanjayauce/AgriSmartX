import { BarChart, Dashboard, Folder, Group, Mail, VolunteerActivism } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ResourceProviderSidebar.css';

const NGOSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navLinks = [
    { path: '/ngo/dashboard', label: t('sidebar.ngoDashboard'), icon: <Dashboard sx={{ mr: 1 }} /> },
    { path: '/ngo/projects', label: t('sidebar.ngoProjects'), icon: <Folder sx={{ mr: 1 }} /> },
    { path: '/ngo/beneficiaries', label: t('sidebar.ngoBeneficiaries'), icon: <Group sx={{ mr: 1 }} /> },
    { path: '/ngo/volunteers', label: t('sidebar.ngoVolunteers'), icon: <VolunteerActivism sx={{ mr: 1 }} /> },
    { path: '/ngo/reports', label: t('sidebar.ngoReports'), icon: <BarChart sx={{ mr: 1 }} /> },
    { path: '/messages', label: t('sidebar.messages'), icon: <Mail sx={{ mr: 1 }} /> },
  ];

  return (
    <>
      <div className={`resource-provider-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="user-info">
          <h3>{user?.role}</h3>
          <p>{user?.email}</p>
        </div>
        <nav>
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => { if (window.innerWidth <= 1050) onToggle(); }}
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

export default NGOSidebar; 