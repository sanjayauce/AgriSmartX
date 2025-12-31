import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './AgenticCropHealth.css';

const AgenticCropHealth = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

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
      setPrediction(null);
      setShowFeedback(false);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check agentic system status
  const checkSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:5003/agentic_status');
      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      console.error('Failed to check system status:', err);
    }
  };

  // Get performance metrics
  const getPerformance = async () => {
    try {
      const response = await fetch('http://localhost:5003/agentic_performance');
      const data = await response.json();
      setPerformance(data);
    } catch (err) {
      console.error('Failed to get performance:', err);
    }
  };

  // Handle form submission with agentic AI
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setShowFeedback(false);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('user_id', user?.email || 'anonymous');
      formData.append('location', 'India'); // You can make this dynamic
      formData.append('user_type', 'farmer');

      // Make API call to agentic backend
      const response = await fetch('http://localhost:5003/agentic_predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Agentic AI analysis failed');
      }
      
      // Store the full enriched JSON response in the state
      setPrediction(data);
      setShowFeedback(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit user feedback for learning
  const submitFeedback = async () => {
    if (!prediction || userRating === 0) return;

    try {
      const feedbackData = {
        session_id: prediction.request_info?.session_id,
        user_rating: userRating,
        feedback: {
          helpful: userRating >= 4,
          suggestions: "User feedback for improvement"
        }
      };

      await fetch('http://localhost:5003/agentic_learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      alert('Thank you for your feedback! The AI system will learn from this.');
      setShowFeedback(false);
      setUserRating(0);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setShowFeedback(false);
    setUserRating(0);
  };

  // Get status color based on health
  const getStatusColor = (isHealthy) => {
    return isHealthy ? '#4CAF50' : '#f44336';
  };

  // Get status icon based on health
  const getStatusIcon = (isHealthy) => {
    return isHealthy ? '🌱' : '⚠️';
  };

  // --- Render Helper Components ---

  const renderExpertAdvisorReport = (report) => (
    <div className="agentic-card">
      <h3>Expert Advisor Report</h3>
      <p><strong>Assessment:</strong> {report.overall_assessment}</p>
      <h4>Immediate Actions:</h4>
      <ul>{report.immediate_actions?.map((action, i) => <li key={i}>{action}</li>)}</ul>
      <h4>Detailed Strategy:</h4>
      <ul>
        {report.detailed_strategy?.preventive_measures?.map((item, i) => <li key={`p-${i}`}><strong>Preventive:</strong> {item}</li>)}
        {report.detailed_strategy?.organic_treatments?.map((item, i) => <li key={`o-${i}`}><strong>Organic:</strong> {item}</li>)}
        {report.detailed_strategy?.chemical_treatments?.map((item, i) => <li key={`c-${i}`}><strong>Chemical:</strong> {item}</li>)}
      </ul>
    </div>
  );

  const renderSustainabilityInsights = (insights) => (
    <div className="agentic-card">
      <h3>Sustainability Insights</h3>
      <p><strong>Score:</strong> {insights.sustainability_score}</p>
      <p>{insights.summary}</p>
      <h4>Eco-Friendly Tips:</h4>
      <ul>
        {insights.tips?.map((tip, i) => (
          <li key={i}><strong>{tip.tip}:</strong> {tip.benefit}</li>
        ))}
      </ul>
    </div>
  );

  const renderCommunityWisdom = (wisdom) => (
    <div className="agentic-card">
      <h3>Wisdom from the Community</h3>
      <p>{wisdom.summary}</p>
      <h4>Top Tips from Farmers:</h4>
      <ul>
        {wisdom.top_tips?.map((tip, i) => (
          <li key={i}>"{tip.tip}" <em>(Success Rate: {tip.success_rate})</em></li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="agentic-crop-health-container">
      <div className="agentic-crop-health-header">
        <h1>🤖 Agentic AI Crop Health Analysis</h1>
        <p className="welcome-message">
          Welcome, {user?.email}! Experience the next generation of AI-powered crop health analysis.
        </p>
        <div className="agentic-features">
          <span className="feature">🧠 Autonomous Decision Making</span>
          <span className="feature">💾 Memory & Learning</span>
          <span className="feature">🔧 Tool Usage</span>
          <span className="feature">🎯 Goal-Oriented</span>
        </div>
      </div>

      <div className="agentic-crop-health-content">
        {/* System Status Section */}
        <div className="system-status-section">
          <h2>🔍 System Status</h2>
          <div className="status-buttons">
            <button onClick={checkSystemStatus} className="status-btn">
              Check System Status
            </button>
            <button onClick={getPerformance} className="status-btn">
              View Performance
            </button>
          </div>
          
          {systemStatus && (
            <div className="status-display">
              <h3>System Status: {systemStatus.status}</h3>
              <div className="agents-status">
                {Object.entries(systemStatus.agents).map(([name, info]) => (
                  <div key={name} className="agent-status">
                    <strong>{name}:</strong> {info.status} | Tools: {info.tools} | Goals: {info.goals}
                  </div>
                ))}
              </div>
            </div>
          )}

          {performance && (
            <div className="performance-display">
              <h3>Performance Metrics</h3>
              <div className="performance-data">
                {Object.entries(performance.system_performance).map(([name, data]) => (
                  <div key={name} className="agent-performance">
                    <strong>{name}:</strong> Success Rate: {(data.performance_7_days.success_rate * 100).toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
                className="analyze-btn agentic"
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? '🤖 Agentic AI Analyzing...' : '🤖 Analyze with Agentic AI'}
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
          <div className="loading-state agentic">
            <div className="loading-spinner agentic"></div>
            <p>🤖 Agentic AI is analyzing your crop image...</p>
            <p className="loading-note">This may take a few seconds as the AI agents coordinate</p>
          </div>
        )}

        {/* Results Section */}
        {prediction && (
          <div className="results-section">
            <h2>{prediction.report_title}</h2>
            
            {prediction.expert_advisor_report && renderExpertAdvisorReport(prediction.expert_advisor_report)}
            {prediction.sustainability_insights && renderSustainabilityInsights(prediction.sustainability_insights)}
            {prediction.community_wisdom && renderCommunityWisdom(prediction.community_wisdom)}
            
            <div className="prediction-card agentic">
              <div 
                className="prediction-header"
                style={{ borderColor: getStatusColor(prediction.prediction.is_healthy) }}
              >
                <span className="status-icon">
                  {getStatusIcon(prediction.prediction.is_healthy)}
                </span>
                <h3>
                  {prediction.prediction.is_healthy ? 'Healthy Plant' : 'Disease Detected'}
                </h3>
              </div>

              <div className="prediction-details">
                <div className="detail-row">
                  <span className="detail-label">Crop:</span>
                  <span className="detail-value">{prediction.prediction.crop}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Condition:</span>
                  <span className="detail-value">{prediction.prediction.disease}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Confidence:</span>
                  <span className="detail-value">
                    {prediction.prediction.confidence}
                  </span>
                </div>
              </div>

              {/* Agentic AI Metadata */}
              {prediction.agentic_metadata && (
                <div className="agentic-metadata">
                  <h4>🤖 Agentic AI Insights</h4>
                  <div className="metadata-grid">
                    <div className="metadata-item">
                      <strong>Agents Used:</strong> {prediction.agentic_metadata.agents_used.join(', ')}
                    </div>
                    <div className="metadata-item">
                      <strong>Total Actions:</strong> {prediction.agentic_metadata.total_actions}
                    </div>
                    <div className="metadata-item">
                      <strong>Overall Confidence:</strong> {(prediction.agentic_metadata.overall_confidence * 100).toFixed(1)}%
                    </div>
                    <div className="metadata-item">
                      <strong>Learning Applied:</strong> {prediction.agentic_metadata.learning_applied ? '✅ Yes' : '❌ No'}
                    </div>
                    <div className="metadata-item">
                      <strong>Conflicts Resolved:</strong> {prediction.agentic_metadata.conflicts_resolved}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Response */}
              {prediction.agentic_response && (
                <div className="enhanced-response">
                  <h4>🎯 Enhanced Recommendations</h4>
                  {prediction.agentic_response.title && (
                    <h5>{prediction.agentic_response.title}</h5>
                  )}
                  
                  {prediction.agentic_response.treatment_steps && (
                    <div className="treatment-steps">
                      <h6>Treatment Steps:</h6>
                      <ol>
                        {prediction.agentic_response.treatment_steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {prediction.agentic_response.recommended_products && (
                    <div className="recommended-products">
                      <h6>Recommended Products:</h6>
                      <ul>
                        {prediction.agentic_response.recommended_products.map((product, index) => (
                          <li key={index}>
                            {typeof product === 'string' ? product : product.name}
                            {typeof product === 'object' && product.availability && (
                              <span className="availability"> (Available: {product.availability})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.agentic_response.disclaimer && (
                    <div className="disclaimer">
                      <p><strong>Disclaimer:</strong> {prediction.agentic_response.disclaimer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Feedback Section */}
            {showFeedback && (
              <div className="feedback-section">
                <h4>💬 Help us improve the AI</h4>
                <p>How helpful was this analysis?</p>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={`rating-btn ${userRating === rating ? 'selected' : ''}`}
                      onClick={() => setUserRating(rating)}
                    >
                      {rating} ⭐
                    </button>
                  ))}
                </div>
                <button 
                  onClick={submitFeedback}
                  disabled={userRating === 0}
                  className="submit-feedback-btn"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenticCropHealth; 