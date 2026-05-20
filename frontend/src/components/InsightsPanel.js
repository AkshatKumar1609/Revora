import React from 'react';
import './InsightsPanel.css';

const InsightsPanel = ({ marketingInsights, productImprovements, frequentlyMentionedFeatures }) => {
  // Helper function to extract numeric value from value (handles objects and primitives)
  const getValue = (val) => {
    if (typeof val === 'object' && val !== null) {
      // If it's an object with 'mentions' property, use that
      return val.mentions !== undefined ? val.mentions : Object.values(val)[0];
    }
    return val;
  };

  // Helper function to render value as string
  const renderValue = (val) => {
    if (typeof val === 'object' && val !== null) {
      // If it's an object, convert to string or extract key info
      if (val.mentions !== undefined) {
        return `${val.mentions} mentions`;
      }
      return String(val);
    }
    return String(val);
  };

  return (
    <div className="insights-panel">
      <div className="insight-card">
        <h3>📊 Marketing Insights</h3>
        <ul>
          {marketingInsights && Object.entries(marketingInsights).length > 0 ? (
            Object.entries(marketingInsights).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {renderValue(value)}
              </li>
            ))
          ) : (
            <li className="empty">No insights available</li>
          )}
        </ul>
      </div>

      <div className="insight-card">
        <h3>🔧 Product Improvements</h3>
        <ul>
          {productImprovements && productImprovements.length > 0 ? (
            productImprovements.map((improvement, idx) => (
              <li key={idx}>
                {typeof improvement === 'object' ? improvement.suggestion : improvement}
              </li>
            ))
          ) : (
            <li className="empty">No improvements suggested</li>
          )}
        </ul>
      </div>

      <div className="insight-card">
        <h3>🏷️ Frequently Mentioned Features</h3>
        <ul>
          {frequentlyMentionedFeatures && Object.entries(frequentlyMentionedFeatures).length > 0 ? (
            Object.entries(frequentlyMentionedFeatures)
              .map(([feature, data]) => [feature, getValue(data)])
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([feature, count]) => (
                <li key={feature}>
                  <strong>{feature}</strong> <span className="count">({count} mentions)</span>
                </li>
              ))
          ) : (
            <li className="empty">No features identified</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InsightsPanel;
