import React from 'react';
import FarmerForm from '../profilecomponents/FarmerForm';
import Hero from '../profilecomponents/Hero';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-page">
      <Hero />
      <FarmerForm />
    </div>
  );
};

export default Profile; 