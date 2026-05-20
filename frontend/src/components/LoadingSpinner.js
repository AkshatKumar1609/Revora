import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Analyzing reviews...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
