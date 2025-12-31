import React from 'react';
import governmentAgencies from '../data/governmentAgencies';
import './GovernmentAgencies.css';

const GovernmentAgencies = () => {
  return (
    <div className="gov-agencies-container">
      <h1>Government Agencies in Food Grain Supply Chain</h1>
      <div className="gov-agencies-grid">
        {governmentAgencies.map((agency, idx) => (
          <div className="gov-agency-card" key={idx}>
            {agency.logo && <img src={agency.logo} alt={agency.name} className="gov-agency-logo" />}
            <h2>{agency.name}</h2>
            <p>{agency.description}</p>
            <a href={agency.website} target="_blank" rel="noopener noreferrer" className="gov-agency-link">
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentAgencies; 