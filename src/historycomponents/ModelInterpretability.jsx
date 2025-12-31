import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ModelInterpretability.css';

const ModelInterpretability = ({ cropName, filters }) => {
  const { t } = useTranslation();
  const [interpretations, setInterpretations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      if (!cropName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5001/interpret', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            crop: cropName,
            state: filters.state,
            year: filters.year
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch model interpretations');
        }

        const data = await response.json();
        setInterpretations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterpretations();
  }, [cropName, filters]);

  if (loading) {
    return <div className="interpretability-loading">{t('loading')}</div>;
  }

  if (error) {
    return <div className="interpretability-error">{error}</div>;
  }

  if (!interpretations) {
    return null;
  }

  return (
    <div className="model-interpretability">
      <h3>{t('modelInterpretability')}</h3>
      <div className="interpretability-grid">
        <div className="interpretability-card">
          <h4>{t('limeExplanation')}</h4>
          <img 
            src={`http://localhost:5001/static/lime_explanation.png?t=${Date.now()}`} 
            alt="LIME Explanation"
            className="interpretability-image"
          />
        </div>
        <div className="interpretability-card">
          <h4>{t('shapSummary')}</h4>
          <img 
            src={`http://localhost:5001/static/shap_summary.png?t=${Date.now()}`} 
            alt="SHAP Summary"
            className="interpretability-image"
          />
        </div>
        <div className="interpretability-card">
          <h4>{t('shapDependence')}</h4>
          <img 
            src={`http://localhost:5001/static/shap_dependence.png?t=${Date.now()}`} 
            alt="SHAP Dependence"
            className="interpretability-image"
          />
        </div>
      </div>
    </div>
  );
};

export default ModelInterpretability; 