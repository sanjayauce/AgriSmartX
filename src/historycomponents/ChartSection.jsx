import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Area,
    AreaChart,
    Brush,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import './ChartSection.css';

const ChartSection = ({ title, filters, chartData, cropType }) => {
  const { t, i18n } = useTranslation();
  // Debug log
  console.log('ChartSection language:', i18n.language, 'production:', t('production'));
  const [chartType, setChartType] = useState('production');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const saveToReports = () => {
    if (!chartData || !chartData.trends) return;

    setIsSaving(true);
    setSaveStatus(null);

    // Simulate a small delay to show loading state
    setTimeout(() => {
      try {
        const reportData = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          filters: { 
            ...filters,
            crop: filters.primaryCrop.toLowerCase().replace(/\s+/g, '') // Convert crop to lowercase and remove spaces
          },
          chartType,
          cropType,
          data: chartData.trends[chartType]
        };

        // Get existing reports or initialize empty array
        const existingReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
        existingReports.push(reportData);
        localStorage.setItem('savedReports', JSON.stringify(existingReports));

        setSaveStatus('success');
        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (error) {
        setSaveStatus('error');
        // Clear error message after 3 seconds
        setTimeout(() => setSaveStatus(null), 3000);
      } finally {
        setIsSaving(false);
      }
    }, 500);
  };

  const renderChart = () => {
    if (!chartData || !chartData.trends) return null;

    let data, unit, isMonthly = false;

    switch (chartType) {
      case 'production':
        data = chartData.trends.production;
        unit = t('tons');
        break;
      case 'yield':
        data = chartData.trends.yield;
        unit = t('tonsPerHectare');
        break;
      case 'area':
        data = chartData.trends.area;
        unit = t('thousandHectares');
        break;
      default:
        return null;
    }

    // Detect if data is monthly (has Month field 1-12)
    if (data && data.length && data[0].Month !== undefined) {
      isMonthly = true;
      data = [...data]
        .map((d, i) => ({
          ...d,
          Month: Number(d.Month),
          index: i
        }))
        .sort((a, b) => a.Month - b.Month);
    } else if (data && Array.isArray(data)) {
      data = [...data]
        .map((d, i) => ({
          ...d,
          Year: String(d.Year),
          index: i // helps in controlling ticks later
        }))
        .sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    }

    // Prepare ticks for months if monthly, else for years
    const monthTicks = [1,2,3,4,5,6,7,8,9,10,11,12];
    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} />
          {isMonthly ? (
            <XAxis
              dataKey="Month"
              type="number"
              domain={[1, 12]}
              ticks={monthTicks}
              tickFormatter={month => monthLabels[month-1]}
              tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
              label={{ value: t('Month') || 'Month', position: 'insideBottom', offset: -20 }}
              interval={0}
            />
          ) : (
            <XAxis
              dataKey="Year"
              tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
              label={{ value: t('chart.configuration.xAxis'), position: 'insideBottom', offset: -20 }}
            />
          )}
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
            name={t(chartType)}
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.2}
          />
          {isMonthly ? (
            <Brush
              dataKey="Month"
              height={30}
              stroke="#8884d8"
              startIndex={0}
              endIndex={monthTicks.length - 1}
            />
          ) : (
            <Brush
              dataKey="Year"
              height={30}
              stroke="#8884d8"
              startIndex={0}
              endIndex={data ? data.length - 1 : 0}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <section className="chart-section">
      <div className="chart-header">
        <h2>{title}</h2>
        <div className="chart-controls">
          <div className="chart-toggle">        
            <button
              className={chartType === 'production' ? 'active' : ''}
              onClick={() => setChartType('production')}
            >
              {t('production')}
            </button>
            <button
              className={chartType === 'area' ? 'active' : ''}
              onClick={() => setChartType('area')}
            >
              {t('area')}
            </button>
            <button
              className={chartType === 'yield' ? 'active' : ''}
              onClick={() => setChartType('yield')}
            >
              {t('yield')}
            </button>
          </div>
          {chartData && (
            <div className="save-report-container">
              <button 
                className={`save-report-button ${isSaving ? 'saving' : ''} ${saveStatus ? saveStatus : ''}`}
                onClick={saveToReports}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="loading-spinner"></span>
                    {t('saving')}
                  </>
                ) : saveStatus === 'success' ? (
                  t('saved')
                ) : saveStatus === 'error' ? (
                  t('saveError')
                ) : (
                  t('saveToReports')
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="chart-container">
        {chartData ? (
          renderChart()
        ) : (
          <div className="chart-placeholder">
            {t('chartPlaceholder')}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChartSection;









// import React from 'react';
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis
// } from 'recharts';
// import './ChartSection.css';

// const ChartSection = ({ filters, chartData }) => {
//   if (!chartData || !chartData.trends) return null;

//   const getValue = (trend) =>
//     Array.isArray(trend) && trend.length > 0 ? trend[0].value : 0;

//   const data = [
//     { label: 'Production', value: getValue(chartData.trends.production), unit: 'Tons' },
//     { label: 'Yield', value: getValue(chartData.trends.yield), unit: 'Tons/Hectare' },
//     { label: 'Area', value: getValue(chartData.trends.area), unit: '1000 Hectares' }
//   ];

//   return (
//     <section className="chart-section">
//       <div className="chart-header">
//         <h2>Production, Yield & Area Analysis</h2>
//         <p>
//           Showing snapshot for: <strong>{filters.crop}</strong> in <strong>{filters.state}</strong>, <strong>{filters.year}</strong>
//         </p>
//       </div>

//       <div className="chart-container">
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart
//             data={data}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="label" />
//             <YAxis />
//             <Tooltip formatter={(value, name) => [`${value}`, '']} />
//             <Legend />
//             <Bar dataKey="value" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </section>
//   );
// };

// export default ChartSection;


