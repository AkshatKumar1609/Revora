import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';

const SENTIMENT_CONFIG = {
  positive: { label: 'Positive', color: '#059669' },
  neutral:  { label: 'Neutral',  color: '#6366f1' },
  negative: { label: 'Negative', color: '#dc2626' },
};

const STAR_COLORS = {
  '1': '#dc2626', '2': '#f97316',
  '3': '#f59e0b', '4': '#10b981', '5': '#0ea5e9',
};

const RatingTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-md shadow-sm px-3 py-2 text-[12px]">
      <span className="font-medium text-zinc-700">{label}★</span>
      <span className="text-zinc-500 ml-2">{payload[0].value} reviews</span>
    </div>
  );
};

export default function SentimentSection({ distribution, total, histogram, avgRating }) {
  const pos = distribution.positive ?? 0;
  const neu = distribution.neutral  ?? 0;
  const neg = distribution.negative ?? 0;
  const t   = pos + neu + neg || 1;

  const ratingData = Object.entries(histogram)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([star, count]) => ({ star, count }));

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Stacked sentiment bar table */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Sentiment Distribution
        </p>

        {/* Stacked bar */}
        <div className="flex h-2.5 rounded overflow-hidden mb-5">
          {[['positive', pos], ['neutral', neu], ['negative', neg]].map(([key, val]) => (
            <div
              key={key}
              style={{
                width: `${(val / t) * 100}%`,
                backgroundColor: SENTIMENT_CONFIG[key].color,
              }}
            />
          ))}
        </div>

        {/* Table */}
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider pb-2">Sentiment</th>
              <th className="text-right text-[10px] font-semibold text-zinc-400 uppercase tracking-wider pb-2">Count</th>
              <th className="text-right text-[10px] font-semibold text-zinc-400 uppercase tracking-wider pb-2">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {[['positive', pos], ['neutral', neu], ['negative', neg]].map(([key, val]) => (
              <tr key={key} className="hover:bg-zinc-50">
                <td className="py-2.5 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: SENTIMENT_CONFIG[key].color }}
                  />
                  <span className="text-zinc-700 capitalize">{SENTIMENT_CONFIG[key].label}</span>
                </td>
                <td className="py-2.5 text-right font-mono text-zinc-900 font-medium">{val}</td>
                <td className="py-2.5 text-right font-mono text-zinc-500">
                  {((val / t) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-zinc-200">
              <td className="pt-2.5 text-zinc-500 font-medium">Total</td>
              <td className="pt-2.5 text-right font-mono text-zinc-900 font-semibold">{t}</td>
              <td className="pt-2.5 text-right font-mono text-zinc-400">100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Rating histogram */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Rating Histogram
          </p>
          {avgRating != null && (
            <span className="font-mono text-[12px] text-zinc-500">
              avg <strong className="text-zinc-800">{avgRating}★</strong>
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={ratingData} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="2 2" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="star" tickFormatter={v => `${v}★`}
              tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false}
              tickLine={false} width={22}
            />
            <Tooltip content={<RatingTooltip />} cursor={{ fill: '#f4f4f5' }} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {ratingData.map(({ star }) => (
                <Cell key={star} fill={STAR_COLORS[star] ?? '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
