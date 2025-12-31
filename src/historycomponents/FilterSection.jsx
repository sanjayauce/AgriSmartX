import React from 'react';
import { useTranslation } from 'react-i18next';
import { mandalsList as andhraPradeshMandalsList } from '../data/andhraPradeshMandalsData';
import { mandalsList as telanganaMandalsList } from '../data/telanganaMandalsData';
import './FilterSection.css';

const FilterSection = ({ filters, onFilterChange, onApplyFilters, isLoading }) => {
  const { t, i18n } = useTranslation();
  
  // Debug log
  console.log('FilterSection language:', i18n.language, 'applyFilters:', t('applyFilters'));
  
  // Define a static list of crops that matches the backend
  const crops = [
    'Rice', 'Wheat', 'Kharif Sorghum', 'Rabi Sorghum', 'Pearl Millet', 'Maize',
    'Finger Millet', 'Barley', 'Chickpea', 'Pigeonpea', 'Minor Pulses',
    'Groundnut', 'Sesamum', 'Rapeseed and Mustard', 'Safflower', 'Castor',
    'Linseed', 'Sunflower', 'Soyabean', 'Oilseeds', 'Sugarcane', 'Cotton'
  ];

  // Define a static list of states
  const states = ['Andhra Pradesh', 'Telangana'];
  
  const years = Array.from({ length: 52 }, (_, i) => (1966 + i).toString());

  // Get districts and mandals based on selected state
  const getDistrictsForState = (state) => {
    if (!state) return [];
    
    const mandalsList = state === 'telangana' ? telanganaMandalsList : andhraPradeshMandalsList;
    const districts = [...new Set(mandalsList.map(mandal => mandal.district))];
    return districts.sort();
  };

  const getMandalsForDistrict = (state, district) => {
    if (!state || !district) return [];
    
    const mandalsList = state === 'telangana' ? telanganaMandalsList : andhraPradeshMandalsList;
    const mandals = mandalsList
      .filter(mandal => mandal.district === district)
      .map(mandal => mandal.mandal)
      .sort();
    return mandals;
  };

  const districts = getDistrictsForState(filters.state);
  const mandals = getMandalsForDistrict(filters.state, filters.district);

  return (
    <section className="filter-section">
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="primaryCrop">{t('primaryCrop')}</label>
          <select
            id="primaryCrop"
            value={filters.primaryCrop}
            onChange={(e) => onFilterChange('primaryCrop', e.target.value)}
            disabled={isLoading}
          >
            <option value="">{t('selectPrimaryCrop')}</option>
            {crops.map(crop => (
              <option key={crop} value={crop.toLowerCase().replace(/ /g, '')} disabled={crop.toLowerCase().replace(/ /g, '') === filters.secondaryCrop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="secondaryCrop">{t('secondaryCrop')}</label>
          <select
            id="secondaryCrop"
            value={filters.secondaryCrop}
            onChange={(e) => onFilterChange('secondaryCrop', e.target.value)}
            disabled={isLoading}
          >
            <option value="">{t('selectSecondaryCrop')}</option>
            {crops.map(crop => (
              <option key={crop} value={crop.toLowerCase().replace(/ /g, '')} disabled={crop.toLowerCase().replace(/ /g, '') === filters.primaryCrop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="state">{t('state')}</label>
          <select
            id="state"
            value={filters.state}
            onChange={(e) => {
              onFilterChange('state', e.target.value);
              // Clear district and mandal when state changes
              onFilterChange('district', '');
              onFilterChange('mandal', '');
            }}
            disabled={isLoading}
          >
            <option value="">{t('selectState')}</option>
            {states.map(state => (
              <option key={state} value={state.toLowerCase().replace(/ /g, '')}>{state}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="district">{t('district')}</label>
          <select
            id="district"
            value={filters.district}
            onChange={(e) => {
              onFilterChange('district', e.target.value);
              // Clear mandal when district changes
              onFilterChange('mandal', '');
            }}
            disabled={isLoading || !filters.state}
          >
            <option value="">{t('selectDistrict')}</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="mandal">{t('mandal')}</label>
          <select
            id="mandal"
            value={filters.mandal}
            onChange={(e) => onFilterChange('mandal', e.target.value)}
            disabled={isLoading || !filters.district}
          >
            <option value="">{t('selectMandal')}</option>
            {mandals.map(mandal => (
              <option key={mandal} value={mandal}>{mandal}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year">{t('year')}</label>
          <select
            id="year"
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            disabled={isLoading}
          >
            <option value="">{t('selectYear')}</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <button 
          className="apply-button"
          onClick={onApplyFilters}
          disabled={!filters.primaryCrop || !filters.state || isLoading}
        >
          {isLoading ? t('loading') : t('applyFilters')}
        </button>
      </div>
    </section>
  );
};

export default FilterSection; 