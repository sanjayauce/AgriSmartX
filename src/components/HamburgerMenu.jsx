import { Menu } from '@mui/icons-material';
import React from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ isOpen, onToggle }) => {
  return (
    <button 
      className={`hamburger-menu ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <Menu />
    </button>
  );
};

export default HamburgerMenu; 