import React, { useState } from 'react';

export default function FeaturesTable({ features }) {
  const [sortKey, setSortKey] = useState('mentions');
  const [sortDir, setSortDir] = useState('desc');

  const entries = Object.entries(features ?? {});

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg px-4 py-8 text-center">
        <p className="text-[12px] text-zinc-400">No feature data available.</p>
      </div>
    );
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...entries].sort(([, a], [, b]) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className="text-zinc-300 ml-1">↕</span>;
    return <span className="text-zinc-600 ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>;
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50 flex items-center">
        <div>
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Feature Mentions
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">{sorted.length} topics extracted — click column headers to sort</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Feature</th>
              {['mentions', 'positive', 'neutral', 'negative'].map(col => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="px-4 py-2.5 text-right text-[10px] font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-600 select-none"
                >
                  {col} <SortIcon col={col} />
                </th>
              ))}
              <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">
                Pos %
              </th>
              <th className="px-4 py-2.5 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {sorted.map(([feature, stats]) => {
              const scored = stats.positive + stats.negative;
              const posPct = scored > 0 ? Math.round((stats.positive / scored) * 100) : null;
              return (
                <tr key={feature} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-zinc-800 capitalize">{feature}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-700">{stats.mentions}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-emerald-600">{stats.positive}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-indigo-500">{stats.neutral}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-red-500">{stats.negative}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-500">
                    {posPct != null ? `${posPct}%` : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    {posPct != null && (
                      <div className="w-full h-1.5 bg-zinc-100 rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${posPct}%`,
                            backgroundColor: posPct >= 70 ? '#059669' : posPct >= 50 ? '#f59e0b' : '#dc2626',
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
