import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';

const STAR_COLORS = {
  '1': '#ef4444', '2': '#f97316',
  '3': '#f59e0b', '4': '#10b981', '5': '#06b6d4',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0c1022', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#f1f5f9',
    }}>
      <strong>{label}★</strong> — {payload[0].value} reviews
    </div>
  );
};

export default function RatingChart({ histogram, avgRating }) {
  const data = Object.entries(histogram)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([star, count]) => ({ star, count }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Rating Breakdown</h2>
          <p className="card-subtitle">
            {avgRating != null ? `Average ${avgRating} stars` : 'Star distribution'}
          </p>
        </div>
        <span className="card-chip">
          {avgRating != null ? `${avgRating}★` : 'Ratings'}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={175}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="star"
            tickFormatter={v => `${v}★`}
            tick={{ fill: '#8892a4', fontSize: 12 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4a5568', fontSize: 11 }}
            axisLine={false} tickLine={false} width={26}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map(({ star }) => (
              <Cell key={star} fill={STAR_COLORS[star] ?? '#7c3aed'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
