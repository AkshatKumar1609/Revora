import React from 'react';

export default function ProsCons({ items, type }) {
  const isPro     = type === 'pro';
  const title     = isPro ? 'Pros' : 'Cons';
  const subtitle  = isPro ? 'What buyers appreciate' : 'Common pain points';
  const chipCls   = isPro ? 'card-chip green' : 'card-chip red';
  const chipLabel = isPro ? 'Liked' : 'Disliked';
  const tagCls    = isPro ? 'pc-tag pc-pro' : 'pc-tag pc-con';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">{title}</h2>
          <p className="card-subtitle">{subtitle}</p>
        </div>
        <span className={chipCls}>{chipLabel}</span>
      </div>

      {items && items.length > 0 ? (
        <div className="tag-cloud">
          {items.map((item, i) => (
            <span key={i} className={tagCls}>{item}</span>
          ))}
        </div>
      ) : (
        <p className="empty-msg">No data available</p>
      )}
    </div>
  );
}
