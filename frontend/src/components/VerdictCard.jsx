import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

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

export default function VerdictCard({ verdict }) {
  const { score, grade, summary } = verdict;
  const pct = Math.min(100, Math.max(0, score));

  const scoreColor =
    grade === 'A' ? '#10b981' :
    grade === 'B' ? '#06b6d4' :
    grade === 'C' ? '#f59e0b' :
    grade === 'D' ? '#f97316' : '#ef4444';

  const pieData = [
    { name: 'Score', value: pct },
    { name: 'Rest',  value: 100 - pct },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Overall Verdict</h2>
          <p className="card-subtitle">Composite product score</p>
        </div>
        <span className="card-chip purple">Score</span>
      </div>

      <div className="verdict-body">
        <div className="gauge-wrap">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                startAngle={90} endAngle={-270}
                innerRadius={44} outerRadius={60}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={scoreColor} />
                <Cell fill="rgba(255,255,255,0.04)" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="gauge-overlay">
            <span className="gauge-score-num">{score}</span>
            <span className="gauge-denom">/ 100</span>
          </div>
        </div>

        <div className="verdict-details">
          <div className={`grade-chip grade-${grade}`}>
            Grade {grade}
          </div>
          <p className="verdict-text">{summary}</p>
        </div>
      </div>
    </div>
  );
}
