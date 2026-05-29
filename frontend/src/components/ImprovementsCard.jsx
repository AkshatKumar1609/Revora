import React from 'react';

export default function ImprovementsCard({ improvements }) {
  const items = improvements ?? [];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Improvement Areas</h2>
          <p className="card-subtitle">Features with more negative than positive mentions</p>
        </div>
        <span className="card-chip red">Action Items</span>
      </div>

      {items.length === 0 ? (
        <p className="empty-msg">No critical issues found — product is well-received 🎉</p>
      ) : (
        <div className="impr-list">
          {items.map((item, i) => (
            <div className="impr-item" key={i}>
              <div className="impr-count">{item.negative}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="impr-name">{item.feature}</div>
                <div className="impr-suggestion">{item.suggestion}</div>
                <div className="impr-pills">
                  <span className="impr-pill pill-pos">✓ {item.positive} positive</span>
                  <span className="impr-pill pill-neg">✗ {item.negative} negative</span>
                  <span className="impr-pill pill-tot">{item.mentions} total</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
