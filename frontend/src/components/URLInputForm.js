import React, { useState } from 'react';
import './URLInputForm.css';

const URLInputForm = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const [maxReviews, setMaxReviews] = useState(100);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a Flipkart product URL');
      return;
    }

    if (!url.includes('flipkart.com')) {
      setError('Please enter a valid Flipkart product URL');
      return;
    }

    onSubmit(url, maxReviews);
  };

  return (
    <div className="url-input-form">
      <h1>Flipkart Review Analyzer</h1>
      <p className="subtitle">Analyze product reviews with AI-powered sentiment analysis</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Flipkart Product URL</label>
          <input
            id="url"
            type="text"
            placeholder="https://www.flipkart.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className={error ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxReviews">
            Maximum Reviews to Analyze: <span>{maxReviews}</span>
          </label>
          <input
            id="maxReviews"
            type="range"
            min="10"
            max="500"
            step="10"
            value={maxReviews}
            onChange={(e) => setMaxReviews(parseInt(e.target.value))}
            disabled={loading}
          />
          <small>10 - 500 reviews</small>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Analyzing...' : 'Analyze Reviews'}
        </button>
      </form>
    </div>
  );
};

export default URLInputForm;
