import React from 'react';

export default function ErrorToast({ message, onClose }) {
  return (
    <div className="error-screen">
      <div className="error-card">
        <span className="error-icon">⚠️</span>
        <h2 className="error-title">Analysis Failed</h2>
        <p className="error-msg">{message}</p>
        <button className="retry-btn" onClick={onClose}>
          ← Try Another URL
        </button>
      </div>
    </div>
  );
}
