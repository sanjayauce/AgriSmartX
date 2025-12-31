import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ChartSection from '../historycomponents/ChartSection';
import '../historycomponents/ChartSection.css';
import ErrorBoundary from '../historycomponents/ErrorBoundary';
import FilterSection from '../historycomponents/FilterSection';
import '../historycomponents/FilterSection.css';
import Hero from '../historycomponents/Hero';
import '../historycomponents/Hero.css';
import InsightsBox from '../historycomponents/InsightsBox';
import '../historycomponents/InsightsBox.css';
import './HistoryPage.css';

const HistoryPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filters, setFilters] = useState({
    primaryCrop: '',
    secondaryCrop: '',
    state: '',
    district: '',
    mandal: '',
    year: ''
  });

  useEffect(() => {
    if (location.state) {
      setFilters(prev => ({
        ...prev,
        primaryCrop: location.state.primaryCrop || '',
        secondaryCrop: location.state.secondaryCrop || '',
        state: location.state.state || '',
        district: location.state.district || '',
        mandal: location.state.mandal || ''
      }));
    }
  }, [location.state]);

  const [primaryChartData, setPrimaryChartData] = useState(null);
  const [secondaryChartData, setSecondaryChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data for primary crop
      const primaryResponse = await fetch('http://localhost:5001/data', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          crop: filters.primaryCrop,
          state: filters.state,
          year: filters.year
        })
      });

      if (!primaryResponse.ok) {
        throw new Error(await primaryResponse.text() || t('fetchError'));
      }

      const primaryData = await primaryResponse.json();
      setPrimaryChartData(primaryData);

      // Fetch data for secondary crop
      const secondaryResponse = await fetch('http://localhost:5001/data', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          crop: filters.secondaryCrop,
          state: filters.state,
          year: filters.year
        })
      });

      if (!secondaryResponse.ok) {
        throw new Error(await secondaryResponse.text() || t('fetchError'));
      }

      const secondaryData = await secondaryResponse.json();
      setSecondaryChartData(secondaryData);
    } catch (err) {
      setError(err.message);
      console.error(t('errorFetchingData'), err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <ErrorBoundary>
        <Hero />
        <main className="main-content">
          <FilterSection 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            isLoading={loading}
          />
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div className="loading">{t('loading')}</div>
          ) : (
            <div className="charts-container">
              <ChartSection 
                title={t('primaryCrop')}
                filters={filters} 
                chartData={primaryChartData}
                cropType="primary"
              />
              <ChartSection 
                title={t('secondaryCrop')}
                filters={filters} 
                chartData={secondaryChartData}
                cropType="secondary"
              />
            </div>
          )}
          <InsightsBox filters={filters} />
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default HistoryPage; 