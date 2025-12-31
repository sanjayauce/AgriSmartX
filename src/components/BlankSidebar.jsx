import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ResourceProviderSidebar.css';

const BlankSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <div className={`resource-provider-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="blank-sidebar-content">
          <button onClick={handleLogout} className="logout-btn">
            {t('sidebar.logout')}
          </button>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
};

export default BlankSidebar; 