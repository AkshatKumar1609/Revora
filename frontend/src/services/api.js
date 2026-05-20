import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analyze a Flipkart product URL for sentiment and reviews
 * @param {string} url - Flipkart product URL
 * @param {number} maxReviews - Maximum number of reviews to scrape (default: 100)
 * @returns {Promise<object>} Analysis report with sentiment, pros/cons, etc.
 */
export const analyzeProduct = async (url, maxReviews = 100) => {
  try {
    const response = await api.post('/analyze', {
      url: url.trim(),
      max_reviews: maxReviews,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Backend returned an error
      const errorMessage = error.response.data?.detail || 'Analysis failed';
      throw new Error(errorMessage);
    } else if (error.request) {
      // No response from backend
      throw new Error('Cannot connect to backend. Make sure the API server is running at ' + API_BASE_URL);
    } else {
      throw new Error(error.message);
    }
  }
};

/**
 * Check if the backend is healthy
 * @returns {Promise<boolean>} True if backend is reachable
 */
export const healthCheck = async () => {
  try {
    await api.get('/health');
    return true;
  } catch {
    console.warn(`Backend health check failed at ${API_BASE_URL}`);
    return false;
  }
};
