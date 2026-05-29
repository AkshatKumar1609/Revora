import React from 'react';

export default function MarketingCard({ insights }) {
  const { positive_rate, negative_rate, summary } = insights ?? {};

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Marketing Insights</h2>
          <p className="card-subtitle">Key takeaways for sellers &amp; teams</p>
        </div>
        <span className="card-chip purple">Insights</span>
      </div>

      <div className="mkt-rates">
        <div className="mkt-rate-tile">
          <div className="mkt-rate-num pos">{positive_rate ?? '—'}</div>
          <div className="mkt-rate-lbl">Buyer Satisfaction</div>
        </div>
        <div className="mkt-rate-tile">
          <div className="mkt-rate-num neg">{negative_rate ?? '—'}</div>
          <div className="mkt-rate-lbl">Dissatisfaction</div>
        </div>
      </div>

      {summary && (
        <div className="mkt-summary">{summary}</div>
      )}
    </div>
  );
}
