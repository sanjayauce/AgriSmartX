import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import './Reports.css';

const Reports = () => {
  const { t, i18n } = useTranslation();
  const [savedReports, setSavedReports] = useState([]);

  // Debug log
  console.log('Reports language:', i18n.language, 'reports:', t('reports'));

  useEffect(() => {
    loadSavedReports();
  }, [i18n.language]);

  const loadSavedReports = () => {
    const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    setSavedReports(reports.sort((a, b) => b.timestamp - a.timestamp));
  };

  const deleteReport = (reportId) => {
    const updatedReports = savedReports.filter(report => report.id !== reportId);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
    setSavedReports(updatedReports);
  };

  const handleClearAll = () => {
    localStorage.removeItem('savedReports');
    setSavedReports([]);
  };

  const renderChart = (report) => {
    const data = report.data.map(d => ({
      ...d,
      Year: String(d.Year)
    })).sort((a, b) => parseInt(a.Year) - parseInt(b.Year));

    let title, unit;
    switch (report.chartType) {
      case 'production':
        title = t('production');
        unit = t('tons');
        break;
      case 'yield':
        title = t('yield');
        unit = t('tonsPerHectare');
        break;
      case 'area':
        title = t('area');
        unit = t('thousandHectares');
        break;
      default:
        return null;
    }

    return (
      <div className="report-chart">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Year"
              tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
              label={{ value: t('chart.configuration.xAxis'), position: 'insideBottom', offset: -20 }}
            />
            <YAxis 
              label={{ 
                value: unit, 
                angle: -90, 
                position: 'insideLeft',
                offset: -10
              }} 
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              name={title}
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>{t('reports')}</h1>
        {savedReports.length > 0 && (
          <button 
            className="clear-all-button"
            onClick={handleClearAll}
            title={t('clearAll')}
          >
            {t('clearAll')}
          </button>
        )}
      </div>
      {savedReports.length === 0 ? (
        <div className="no-reports">
          <p>{t('noReports')}</p>
        </div>
      ) : (
        <div className="reports-grid">
          {savedReports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-info">
                  <h3>{t(`crops.${report.filters.crop}`)} - {t(`states.${report.filters.state}`)}</h3>
                  <p>{new Date(report.timestamp).toLocaleString()}</p>
                </div>
                <button 
                  className="delete-report"
                  onClick={() => deleteReport(report.id)}
                >
                  {t('delete')}
                </button>
              </div>
              {renderChart(report)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports; 