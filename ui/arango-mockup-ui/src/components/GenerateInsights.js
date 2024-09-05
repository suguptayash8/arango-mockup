import React, { useState } from 'react';
import './GenerateInsights.css';

const GenerateInsights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8060/api/generate-insights', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      setSuccess('Insights are being generated!');
    } catch (err) {
      setError(err.message || 'An error occurred while generating insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-insights-container">
      <div className="dropdown">
        <button className="dropdown-button">
          Generate Insights <span className="arrow">&#9662;</span>
        </button>
        <div className="dropdown-content">
          <button onClick={handleGenerateInsights} disabled={loading}>
            {loading ? 'Generating...' : 'Start'}
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default GenerateInsights;