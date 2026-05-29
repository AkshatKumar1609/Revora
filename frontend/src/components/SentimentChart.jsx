import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

const PALETTE = {
  positive: '#10b981',
  neutral:  '#6366f1',
  negative: '#ef4444',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: '#0c1022', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#f1f5f9',
    }}>
      <strong style={{ textTransform: 'capitalize' }}>{name}</strong>: {value}
    </div>
  );
};

export default function SentimentChart({ distribution, total }) {
  const data = Object.entries(distribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Sentiment Split</h2>
          <p className="card-subtitle">{total} reviews analyzed</p>
        </div>
        <span className="card-chip">Distribution</span>
      </div>

      <ResponsiveContainer width="100%" height={155}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={48} outerRadius={68}
            paddingAngle={3} dataKey="value"
          >
            {data.map(e => (
              <Cell key={e.name} fill={PALETTE[e.name] ?? '#64748b'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="sentiment-legend">
        {data.map(({ name, value }) => {
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return (
            <div className="legend-item" key={name}>
              <div className="legend-swatch" style={{ background: PALETTE[name] ?? '#64748b' }} />
              <span className="legend-lbl">{name}</span>
              <span className="legend-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
