// components/DealerSidebar.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealerSidebarItems } from '../sidebarConfig/dealer';
import './ResourceProviderSidebar.css'; // ✅ reuse your CSS

const DealerSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  console.log("✅ DealerSidebar mounted");
  console.log("📌 DealerSidebar user:", user);

  return (
    <>
      <div className={`resource-provider-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="user-info">
          <h3>{user?.role}</h3>
          <p>{user?.email}</p>
        </div>
        <nav>
          {dealerSidebarItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => { if (window.innerWidth <= 1050) onToggle(); }}
            >
              {item.icon} {t(item.label)}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          {t('sidebar.logout') || 'Logout'}
        </button>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
};

export default DealerSidebar;
