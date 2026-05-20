import React from 'react';
import './ProsConsList.css';

const ProsConsList = ({ pros, cons }) => {
  return (
    <div className="pros-cons-container">
      <div className="pros-section">
        <h3>✅ Pros</h3>
        <ul className="pros-list">
          {pros && pros.length > 0 ? (
            pros.map((pro, idx) => <li key={idx}>{pro}</li>)
          ) : (
            <li className="empty">No notable pros identified</li>
          )}
        </ul>
      </div>

      <div className="cons-section">
        <h3>⚠️ Cons</h3>
        <ul className="cons-list">
          {cons && cons.length > 0 ? (
            cons.map((con, idx) => <li key={idx}>{con}</li>)
          ) : (
            <li className="empty">No notable cons identified</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProsConsList;
