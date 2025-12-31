import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mandalsList as andhraPradeshMandalsList } from '../data/andhraPradeshMandalsData';
import { mandalsList as telanganaMandalsList } from '../data/telanganaMandalsData';
import './FarmerForm.css';

const crops = [
  'Rice',
  'Maize',
  'Cotton',
  'Wheat',
  'Sugarcane',
  'Groundnut',
  'Soybean',
  'Sunflower',
  'Barley',
  'Chickpea',
  'Pigeonpea',
  'Pearl Millet',
  'Finger Millet',
  'Castor',
  'Linseed',
  'Rapeseed and Mustard',
  'Safflower',
  'Sesamum'
];

const countries = [
  'India'
];

const states = {
  'India': [
    'Andhra Pradesh',
    'Telangana'
  ]
};

const districts = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju district',
    'Anakapalli district',
    'Anantapur district',
    'Annamayya district',
    'Bapatla district',
    'Chittoor district',
    'Dr. B.R. Ambedkar Konaseema district',
    'East Godavari district',
    'Eluru district',
    'Guntur district',
    'Kakinada district',
    'Krishna district',
    'Kurnool district',
    'Nandyal district',
    'NTR district',
    'Palnadu district',
    'Parvathipuram Manyam district',
    'Prakasam district',
    'Srikakulam district',
    'Sri Potti Sri Ramulu Nellore district',
    'Sri Sathya Sai district',
    'Tirupati district',
    'Visakhapatnam district',
    'Vizianagaram district',
    'West Godavari district',
    'YSR Kadapa district'
  ],
  'Telangana': [
    'Adilabad district',
    'Bhadradri Kothagudem district',
    'Hyderabad district',
    'Jagtial district',
    'Jangaon district',
    'Jayashankar Bhupalpally district',
    'Jogulamba Gadwal district',
    'Kamareddy district',
    'Karimnagar district',
    'Khammam district',
    'Komaram Bheem Asifabad district',
    'Mahabubabad district',
    'Mahabubnagar district',
    'Mancherial district',
    'Medak district',
    'Medchal-Malkajgiri district',
    'Mulugu district',
    'Nagarkurnool district',
    'Nalgonda district',
    'Narayanpet district',
    'Nirmal district',
    'Nizamabad district',
    'Peddapalli district',
    'Rajanna Sircilla district',
    'Rangareddy district',
    'Sangareddy district',
    'Siddipet district',
    'Suryapet district',
    'Vikarabad district',
    'Wanaparthy district',
    'Warangal district',
    'Yadadri Bhuvanagiri district',
    'Hanamkonda district'
  ]
};

const FarmerForm = () => {
  const { t, i18n } = useTranslation();
  // Debug log
  console.log('FarmerForm language:', i18n.language, 'saveProfile:', t('saveProfile'));
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    country: '',
    state: '',
    district: '',
    mandal: '',
    primaryCrop: '',
    secondaryCrop: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      ...(name === 'country' && { state: '', district: '', mandal: '' }),
      ...(name === 'state' && { district: '', mandal: '' }),
      ...(name === 'district' && { mandal: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a unique key for this profile entry
    const timestamp = new Date().getTime();
    const profileKey = `farmerProfile_${timestamp}`;
    // Store form data in localStorage with unique key
    localStorage.setItem(profileKey, JSON.stringify(formData));
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="farmer-form-container">
      <form onSubmit={handleSubmit} className="farmer-form">
        <div className="form-group">
          <label htmlFor="name">{t('fullName')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t('enterName')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">{t('mobileNumber')}</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            placeholder={t('enterMobile')}
            pattern="[0-9]{10}"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">{t('country')}</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectCountry')}</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {t(`countries.${country.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="state">{t('state')}</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            disabled={!formData.country}
          >
            <option value="">{t('selectState')}</option>
            {formData.country && states[formData.country]?.map(state => (
              <option key={state} value={state}>
                {t(`states.${state.toLowerCase().replace(/\s+/g, '')}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="district">{t('district')}</label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={!formData.state}
          >
            <option value="">{t('selectDistrict')}</option>
            {formData.state && districts[formData.state]?.map(district => {
              const districtKey = district.toLowerCase().replace(/[\s.\-]/g, '');
              return (
                <option key={district} value={district}>
                  {t(`districts.${districtKey}`, district)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mandal">{t('mandal')}</label>
          <select
            id="mandal"
            name="mandal"
            value={formData.mandal}
            onChange={handleChange}
            required
            disabled={!formData.district}
          >
            <option value="">{t('selectMandal')}</option>
            {formData.district && ((formData.state === 'Telangana' ? telanganaMandalsList :
              formData.state === 'Andhra Pradesh' ? andhraPradeshMandalsList : [])
              .filter(m => {
                const mandalDistrict = m.district.replace(/district$/i, '').trim().toLowerCase();
                const selectedDistrict = formData.district.replace(/district$/i, '').trim().toLowerCase();
                return mandalDistrict === selectedDistrict;
              })
              .map(mandal => {
                const mandalKey = mandal.mandal.toLowerCase().replace(/\s+/g, '');
                return (
                  <option key={mandal.mandal} value={mandal.mandal}>
                    {t(`mandals.${mandalKey}`, mandal.mandal)}
                  </option>
                );
              }))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="primaryCrop">{t('primaryCrop')}</label>
          <select
            id="primaryCrop"
            name="primaryCrop"
            value={formData.primaryCrop}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectPrimaryCrop')}</option>
            {crops.map(crop => (
              <option key={crop} value={crop}>
                {t(`crops.${crop.toLowerCase().replace(/\s+/g, '')}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="secondaryCrop">{t('secondaryCrop')}</label>
          <select
            id="secondaryCrop"
            name="secondaryCrop"
            value={formData.secondaryCrop}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectSecondaryCrop')}</option>
            {crops.map(crop => (
              <option key={crop} value={crop} disabled={crop === formData.primaryCrop}>
                {t(`crops.${crop.toLowerCase().replace(/\s+/g, '')}`)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          {t('saveProfile')}
        </button>
      </form>
    </div>
  );
};

export default FarmerForm; 