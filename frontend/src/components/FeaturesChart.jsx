import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0c1022', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#f1f5f9', minWidth: 140,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize', fontSize: 12 }}>
        {label}
      </div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.fill, marginBottom: 3, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>{p.name}</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
      {payload.map(e => (
        <div key={e.value} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
          <span style={{ fontSize: 11, color: '#8892a4' }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function FeaturesChart({ features }) {
  const entries = Object.entries(features ?? {});

  if (entries.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Feature Mentions</h2>
            <p className="card-subtitle">Topics most discussed in reviews</p>
          </div>
          <span className="card-chip purple">Topics</span>
        </div>
        <p className="empty-msg">No feature data available</p>
      </div>
    );
  }

  const data = entries
    .sort(([, a], [, b]) => b.mentions - a.mentions)
    .slice(0, 12)
    .map(([feature, stats]) => ({
      feature: feature.charAt(0).toUpperCase() + feature.slice(1),
      Positive: stats.positive,
      Neutral:  stats.neutral,
      Negative: stats.negative,
    }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Feature Mentions</h2>
          <p className="card-subtitle">Topics most discussed in reviews — split by sentiment</p>
        </div>
        <span className="card-chip purple">Topics</span>
      </div>

      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={data} barCategoryGap="28%" barGap={2}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="feature"
            tick={{ fill: '#8892a4', fontSize: 11 }}
            axisLine={false} tickLine={false}
            interval={0} angle={-15} textAnchor="end" height={46}
          />
          <YAxis
            tick={{ fill: '#4a5568', fontSize: 11 }}
            axisLine={false} tickLine={false} width={26}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
          <Legend content={renderLegend} />
          <Bar dataKey="Positive" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Neutral"  fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
