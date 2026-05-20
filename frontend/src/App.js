import React, { useState } from 'react';
import './App.css';
import URLInputForm from './components/URLInputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeProduct, healthCheck } from './services/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendConnected, setBackendConnected] = useState(true);

  React.useEffect(() => {
    // Check backend connectivity on mount
    const checkBackend = async () => {
      const isHealthy = await healthCheck();
      setBackendConnected(isHealthy);
    };
    checkBackend();
  }, []);

  const handleAnalyzeProduct = async (url, maxReviews) => {
    setLoading(true);
    setError('');
    setAnalysisData(null);

    try {
      const data = await analyzeProduct(url, maxReviews);
      setAnalysisData(data);
      setBackendConnected(true);
    } catch (err) {
      setError(err.message);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Review Analyzer</h1>
          <p>AI-powered Flipkart product review sentiment analysis</p>
        </div>
      </header>

      <main className="app-main">
        {!backendConnected && !analysisData && (
          <div className="connection-warning">
            <strong>⚠️ Backend Connection Warning:</strong> Could not connect to the API server at
            {` ${API_BASE_URL}`}. Make sure the backend is running.
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>❌ Error: {error}</span>
            <button onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {!analysisData ? (
          <>
            <URLInputForm onSubmit={handleAnalyzeProduct} loading={loading} />
            {loading && <LoadingSpinner />}
          </>
        ) : (
          <AnalysisDashboard data={analysisData} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Review Analyzer | Powered by FastAPI & React</p>
      </footer>
    </div>
  );
}

export default App;
