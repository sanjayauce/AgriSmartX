import React from 'react';
import './GovernmentAgenciesDashboard.css';

const GovernmentAgenciesDashboard = () => {
  return (
    <div className="gov-dashboard-container">
      <aside className="gov-dashboard-sidebar">
        <ul>
          <li>Agency Overview</li>
          <li>Food Grain Flow</li>
          <li>Storage & Warehousing</li>
          <li>Distribution Stats</li>
          <li>Policy Updates</li>
          <li>Reports & Analytics</li>
        </ul>
      </aside>
      <section className="gov-dashboard-main">
        <h1>Government Agencies Dashboard</h1>
        <p>This is a placeholder dashboard for the Government Agencies role. You can customize these sidebar items and main content as needed.</p>
      </section>
    </div>
  );
};

export default GovernmentAgenciesDashboard; 