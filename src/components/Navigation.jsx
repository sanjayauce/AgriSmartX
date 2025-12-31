import { BusinessCenter } from '@mui/icons-material';
import React from 'react';

const Navigation = () => {
  const navigationItems = [
    {
      text: 'Resource Providers',
      icon: <BusinessCenter />,
      path: '/resource-providers'
    },
  ];

  return (
    <div>
      {/* Render your navigation items here */}
    </div>
  );
};

export default Navigation; 