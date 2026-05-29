import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0c1022', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#f1f5f9',
    }}>
      <strong style={{ textTransform: 'capitalize' }}>{label}</strong>
      <br />
      <span style={{ color: '#a78bfa' }}>Satisfaction: {payload[0].value}%</span>
    </div>
  );
};

export default function AspectRadar({ radar }) {
  const entries = Object.entries(radar ?? {});

  if (entries.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Aspect Satisfaction</h2>
            <p className="card-subtitle">Feature-level sentiment scores</p>
          </div>
          <span className="card-chip purple">Radar</span>
        </div>
        <p className="empty-msg">Not enough data to build radar</p>
      </div>
    );
  }

  const data = entries.map(([feature, score]) => ({
    feature: feature.charAt(0).toUpperCase() + feature.slice(1),
    score,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Aspect Satisfaction</h2>
          <p className="card-subtitle">Feature-level sentiment scores</p>
        </div>
        <span className="card-chip purple">Radar</span>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} margin={{ top: 10, right: 28, bottom: 10, left: 28 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="feature"
            tick={{ fill: '#8892a4', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90} domain={[0, 100]}
            tick={{ fill: '#4a5568', fontSize: 10 }}
            tickCount={4} axisLine={false}
          />
          <Radar
            name="Satisfaction"
            dataKey="score"
            stroke="#a855f7"
            fill="#7c3aed"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: '#c084fc', r: 3, strokeWidth: 0 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="sentiment-legend" style={{ marginTop: 4 }}>
        {data.map(({ feature, score }) => (
          <div className="legend-item" key={feature}>
            <div className="legend-swatch" style={{ background: '#a855f7' }} />
            <span className="legend-lbl">{feature}</span>
            <span className="legend-pct">{score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
