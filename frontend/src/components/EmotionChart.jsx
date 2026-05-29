import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';

const EMOTION_COLORS = {
  excitement:     '#f59e0b',
  joy:            '#10b981',
  satisfaction:   '#06b6d4',
  neutral:        '#6366f1',
  disappointment: '#f97316',
  frustration:    '#ef4444',
  anger:          '#dc2626',
};

const EMOTION_EMOJI = {
  excitement:     '🤩',
  joy:            '😊',
  satisfaction:   '😌',
  neutral:        '😐',
  disappointment: '😕',
  frustration:    '😤',
  anger:          '😡',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0c1022', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#f1f5f9',
    }}>
      <strong style={{ textTransform: 'capitalize' }}>
        {EMOTION_EMOJI[label] ?? ''} {label}
      </strong>
      <br />
      <span style={{ color: '#8892a4' }}>{payload[0].value}% of reviews</span>
    </div>
  );
};

export default function EmotionChart({ emotions }) {
  const data = Object.entries(emotions ?? {})
    .sort(([, a], [, b]) => b - a)
    .map(([emotion, pct]) => ({ emotion, pct }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Emotion Distribution</h2>
          <p className="card-subtitle">How buyers feel about this product</p>
        </div>
        <span className="card-chip">Feelings</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barCategoryGap="28%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            horizontal={false}
          />
          <XAxis
            type="number" domain={[0, 100]}
            tick={{ fill: '#4a5568', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <YAxis
            type="category" dataKey="emotion" width={110}
            tick={{ fill: '#8892a4', fontSize: 12 }}
            axisLine={false} tickLine={false}
            tickFormatter={v =>
              `${EMOTION_EMOJI[v] ?? ''} ${v.charAt(0).toUpperCase() + v.slice(1)}`
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
            {data.map(({ emotion }) => (
              <Cell key={emotion} fill={EMOTION_COLORS[emotion] ?? '#7c3aed'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
