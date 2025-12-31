import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './CropHealth.css';

const CropHealth = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [expertReport, setExpertReport] = useState(null);
  const [sustainabilityReport, setSustainabilityReport] = useState(null);
  const [communityReport, setCommunityReport] = useState(null);
  const [ndviReport, setNdviReport] = useState(null);
  const [agenticMetadata, setAgenticMetadata] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF, BMP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setPredictionResult(null);
      setExpertReport(null);
      setSustainabilityReport(null);
      setCommunityReport(null);
      setNdviReport(null);
      setAgenticMetadata(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);
    setExpertReport(null);
    setSustainabilityReport(null);
    setCommunityReport(null);
    setNdviReport(null);
    setAgenticMetadata(null);

    try {
      // Create FormData for file upload with user context for agentic AI
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Add user context for agentic AI to provide personalized responses
      formData.append('user_id', user?.email || 'anonymous');
      formData.append('user_type', 'farmer');
      formData.append('location', 'India'); // You can make this dynamic based on user profile
      
      // Add language preference for localized responses
      const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
      formData.append('language', currentLanguage);

      // Make API call to agentic AI backend
      const response = await fetch('http://localhost:5003/agentic_predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': currentLanguage
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to predict crop health');
      }
      
      // Store the full enriched JSON response from agentic AI
      setPredictionResult(data.prediction);
      setExpertReport(data.expert_advisor_report);
      setSustainabilityReport(data.sustainability_insights);
      setCommunityReport(data.community_wisdom);
      setNdviReport(data.ndvi_analysis);
      setAgenticMetadata(data.agentic_metadata);
      
    } catch (err) {
      setError(err.message || 'An error occurred while processing the image');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    setExpertReport(null);
    setSustainabilityReport(null);
    setCommunityReport(null);
    setNdviReport(null);
    setAgenticMetadata(null);
    setError(null);
  };

  // Get status color based on health
  const getStatusColor = (isHealthy) => {
    return isHealthy ? '#4CAF50' : '#f44336';
  };

  // Get status icon based on health
  const getStatusIcon = (isHealthy) => {
    return isHealthy ? '🌱' : '⚠️';
  };

  // --- Render Functions for Agent Reports ---

  const renderExpertAdvisorReport = () => {
    if (!expertReport || Object.keys(expertReport).length === 0) return null;

    return (
      <div className="agent-report-card expert-advisor">
        <div className="agent-card-header">
          <h3><i className="fas fa-user-md"></i> Expert Advisor Report</h3>
        </div>
        <h4>{expertReport.title}</h4>
        <p><strong>Overall Assessment:</strong> {expertReport.overall_assessment}</p>
        
        <div className="report-section">
          <h5>Immediate Actions</h5>
          <ul>
            {expertReport.immediate_actions?.map((action, index) => <li key={index}>{action}</li>)}
          </ul>
        </div>

        <div className="report-section">
          <h5>Detailed Strategy</h5>
          {expertReport.detailed_strategy && Object.entries(expertReport.detailed_strategy).map(([key, value]) => (
            <div key={key}>
              <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
              <ul>{Array.isArray(value) && value.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="report-section">
          <h5>Environmental Analysis</h5>
          {expertReport.environmental_analysis && Object.entries(expertReport.environmental_analysis).map(([key, value]) => (
            <p key={key}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}</p>
          ))}
        </div>

        <div className="report-section">
          <h5>Risk Analysis</h5>
          <ul>
            {expertReport.risk_analysis?.potential_risks?.map((riskItem, index) => (
              <li key={index}>
                <strong>{riskItem.risk}</strong> (Probability: {riskItem.probability}) - Mitigation: {riskItem.mitigation}
              </li>
            ))}
          </ul>
        </div>

        <div className="report-section">
          <h5>Cost Analysis</h5>
          {expertReport.cost_analysis && (
            <>
              <p><strong>Estimated Costs:</strong> {expertReport.cost_analysis.estimated_costs}</p>
              <p><strong>Budget Considerations:</strong> {expertReport.cost_analysis.budget_considerations}</p>
              <div>
                <strong>Cost-Effective Alternatives:</strong>
                <ul>
                  {expertReport.cost_analysis.cost_effective_alternatives?.map((alt, i) => <li key={i}>{alt}</li>)}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="report-section">
          <h5>Implementation Timeline</h5>
          {expertReport.implementation_timeline && Object.entries(expertReport.implementation_timeline).map(([key, value]) => (
             <div key={key}>
              <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
              <ul>{Array.isArray(value) && value.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          ))}
        </div>

        <p className="disclaimer">{expertReport.disclaimer}</p>
      </div>
    );
  };

  const renderSustainabilityReport = () => {
    if (!sustainabilityReport || !sustainabilityReport.synthesized_response) return null;

    const { synthesized_response, recommendations } = sustainabilityReport;

    return (
      <div className="agent-report-card sustainability-insights">
        <div className="agent-card-header">
          <h3><i className="fas fa-leaf"></i> Sustainability Insights</h3>
        </div>
        <p><strong>Diagnosis:</strong> {synthesized_response.diagnosis}</p>
        {synthesized_response.details && <p>{synthesized_response.details}</p>}
        {synthesized_response.additional_notes && <p><strong>Additional Notes:</strong> {synthesized_response.additional_notes}</p>}
        <div className="report-section">
          <h5>Recommendations</h5>
          <ul>
            {recommendations?.map((rec, index) => <li key={index}>{rec}</li>)}
          </ul>
        </div>
        {synthesized_response.disclaimer && <p className="disclaimer">{synthesized_response.disclaimer}</p>}
      </div>
    );
  };

  const renderCommunityWisdomReport = () => {
    if (!communityReport || !communityReport.synthesized_response) return null;
    
    const { synthesized_response, recommendations } = communityReport;

    return (
      <div className="agent-report-card community-wisdom">
        <div className="agent-card-header">
          <h3><i className="fas fa-users"></i> Community Wisdom</h3>
        </div>
        <p><strong>Diagnosis:</strong> {synthesized_response.diagnosis}</p>
        {synthesized_response.details && <p>{synthesized_response.details}</p>}
        <div className="report-section">
          <h5>Recommendations from the Community</h5>
          <ul>
            {recommendations?.map((rec, index) => <li key={index}>{rec}</li>)}
          </ul>
        </div>
        {synthesized_response.additional_info && <p><strong>Additional Info:</strong> {synthesized_response.additional_info}</p>}
        {synthesized_response.additional_notes && <p><strong>Additional Notes:</strong> {synthesized_response.additional_notes}</p>}
      </div>
    );
  };

  const renderNDVIAnalysis = () => {
    if (!ndviReport) return null;

    return (
      <div className="agent-report-card ndvi-analysis">
        <div className="agent-card-header">
          <h3><i className="fas fa-chart-line"></i> NDVI Vegetation Health Analysis</h3>
        </div>
        
        {ndviReport.ndvi_score && (
          <div className="report-section">
            <h5>NDVI Score</h5>
            <div className="ndvi-score-display">
              <span className="ndvi-value">{ndviReport.ndvi_score.score}</span>
              <span className="ndvi-status">{ndviReport.ndvi_score.health_status}</span>
            </div>
            <p><strong>Interpretation:</strong> {ndviReport.ndvi_score.interpretation}</p>
            <p><strong>Scale:</strong> {ndviReport.ndvi_score.scale}</p>
          </div>
        )}

        {ndviReport.vegetation_health && (
          <div className="report-section">
            <h5>Vegetation Health Assessment</h5>
            <p><strong>Health Level:</strong> {ndviReport.vegetation_health.health_level}</p>
            <p><strong>Monitoring Schedule:</strong> {ndviReport.vegetation_health.monitoring_schedule}</p>
            
            {ndviReport.vegetation_health.stress_factors && ndviReport.vegetation_health.stress_factors.length > 0 && (
              <div>
                <strong>Stress Factors:</strong>
                <ul>
                  {ndviReport.vegetation_health.stress_factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {ndviReport.vegetation_health.recommendations && (
              <div>
                <strong>Recommendations:</strong>
                <ul>
                  {ndviReport.vegetation_health.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {ndviReport.comprehensive_report && (
          <div className="report-section">
            <h5>Comprehensive Analysis</h5>
            
            {ndviReport.comprehensive_report.vegetation_assessment && (
              <div>
                <strong>Vegetation Assessment:</strong>
                <ul>
                  <li>Overall Health: {ndviReport.comprehensive_report.vegetation_assessment.overall_health}</li>
                  <li>Health Level: {ndviReport.comprehensive_report.vegetation_assessment.health_level}</li>
                  <li>NDVI Interpretation: {ndviReport.comprehensive_report.vegetation_assessment.ndvi_interpretation}</li>
                </ul>
              </div>
            )}

            {ndviReport.comprehensive_report.stress_analysis && (
              <div>
                <strong>Stress Analysis:</strong>
                <ul>
                  <li>Severity: {ndviReport.comprehensive_report.stress_analysis.severity}</li>
                  {ndviReport.comprehensive_report.stress_analysis.primary_factors && 
                   ndviReport.comprehensive_report.stress_analysis.primary_factors.map((factor, index) => (
                     <li key={index}>{factor}</li>
                   ))}
                </ul>
              </div>
            )}

            {ndviReport.comprehensive_report.management_recommendations && (
              <div>
                <strong>Management Recommendations:</strong>
                <div>
                  <strong>Immediate Actions:</strong>
                  <ul>
                    {ndviReport.comprehensive_report.management_recommendations.immediate_actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Long-term Strategy:</strong>
                  <ul>
                    {ndviReport.comprehensive_report.management_recommendations.long_term_strategy.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {ndviReport.comprehensive_report.monitoring_guidelines && (
              <div>
                <strong>Monitoring Guidelines:</strong>
                <ul>
                  <li>Frequency: {ndviReport.comprehensive_report.monitoring_guidelines.frequency}</li>
                  {ndviReport.comprehensive_report.monitoring_guidelines.key_indicators.map((indicator, index) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>
            )}

            {ndviReport.comprehensive_report.recovery_timeline && (
              <div>
                <strong>Recovery Timeline:</strong>
                <ul>
                  <li>Expected Improvement: {ndviReport.comprehensive_report.recovery_timeline.expected_improvement}</li>
                  <li>Full Recovery: {ndviReport.comprehensive_report.recovery_timeline.full_recovery}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="crop-health-container">
      <div className="crop-health-header">
        <h1>🌾 Agentic AI Crop Health Analysis</h1>
        <p className="welcome-message">
          Welcome, {user?.email}! Upload a leaf or crop image for enhanced AI-powered health analysis with autonomous decision-making.
        </p>
        <div className="agentic-badge">
          <span>🤖 Powered by Agentic AI</span>
        </div>
      </div>

      <div className="crop-health-content">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>📸 Upload Image</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="file-input-container">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                disabled={isLoading}
              />
              <label htmlFor="image-upload" className="file-input-label">
                {selectedFile ? selectedFile.name : 'Choose an image file...'}
              </label>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="image-preview">
                <h3>Image Preview:</h3>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="preview-image"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                type="submit" 
                className="analyze-btn"
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? '🔍 Analyzing...' : '🔍 Analyze Crop Health'}
              </button>
              
              <button 
                type="button" 
                className="reset-btn"
                onClick={handleReset}
                disabled={isLoading}
              >
                🔄 Reset
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>🤖 Agentic AI analyzing your crop image...</p>
            <p className="loading-note">Multiple AI agents are coordinating to provide enhanced analysis</p>
          </div>
        )}

        {/* Results Section */}
        {predictionResult && (
          <div className="results-section">
            <div className="results-grid">

              {/* Basic Prediction Card */}
              <div className="prediction-card">
                <div 
                  className="prediction-header"
                  style={{ borderColor: getStatusColor(predictionResult.is_healthy) }}
                >
                  <span className="status-icon">
                    {getStatusIcon(predictionResult.is_healthy)}
                  </span>
                  <h3>
                    {predictionResult.is_healthy ? 'Healthy Plant' : 'Disease Detected'}
                  </h3>
                </div>

                <div className="prediction-details">
                  <div className="detail-row">
                    <span className="detail-label">Crop:</span>
                    <span className="detail-value">{predictionResult.crop}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Condition:</span>
                    <span className="detail-value">{predictionResult.disease}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Confidence:</span>
                    <span className="detail-value">{predictionResult.confidence}</span>
                  </div>
                </div>
              </div>

              {/* Agentic Metadata Card */}
              {agenticMetadata && (
                <div className="agentic-metadata-card">
                   <div className="agent-card-header">
                      <h3><i className="fas fa-cogs"></i> Agentic AI Details</h3>
                    </div>
                  <div className="metadata-grid">
                    <div><strong>Agents Used:</strong> {agenticMetadata.agents_used?.join(', ')}</div>
                    <div><strong>Total Actions:</strong> {agenticMetadata.total_actions}</div>
                    <div><strong>Overall Confidence:</strong> {agenticMetadata.overall_confidence ? `${(agenticMetadata.overall_confidence * 100).toFixed(1)}%` : 'N/A'}</div>
                    <div><strong>Learning Applied:</strong> {agenticMetadata.learning_applied ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Render Agent Reports */}
            <div className="agent-reports-container">
              {renderExpertAdvisorReport()}
              {renderSustainabilityReport()}
              {renderCommunityWisdomReport()}
              {renderNDVIAnalysis()}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="info-section">
          <h2>ℹ️ How It Works</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>📸 Upload</h3>
              <p>Take a clear photo of the leaf or crop you want to analyze</p>
            </div>
            <div className="info-card">
              <h3>🤖 AI Analysis</h3>
              <p>Our deep learning model analyzes the image for disease patterns</p>
            </div>
            <div className="info-card">
              <h3>📊 Results</h3>
              <p>Get instant results with confidence scores and recommendations</p>
            </div>
          </div>
          
          <div className="tips-section">
            <h3>💡 Tips for Best Results:</h3>
            <ul>
              <li>Use good lighting and clear focus</li>
              <li>Include the entire leaf or affected area</li>
              <li>Avoid shadows or reflections</li>
              <li>Supported formats: JPG, PNG, GIF, BMP (max 5MB)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropHealth; 