import React from 'react';

export default function AspectTable({ radar }) {
  const entries = Object.entries(radar ?? {}).sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Aspect Satisfaction
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">Positive / (Positive + Negative) %</p>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-8 text-center text-[12px] text-zinc-400">Insufficient data.</p>
      ) : (
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Aspect</th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Score</th>
              <th className="px-4 py-2 w-28"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {entries.map(([feature, score]) => (
              <tr key={feature} className="hover:bg-zinc-50">
                <td className="px-4 py-2.5 text-zinc-700 capitalize">{feature}</td>
                <td className="px-4 py-2.5 text-right font-mono text-zinc-900 font-medium">
                  {score}%
                </td>
                <td className="px-4 py-2.5">
                  <div className="w-full h-1.5 bg-zinc-100 rounded overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${score}%`,
                        backgroundColor: score >= 70 ? '#059669' : score >= 50 ? '#f59e0b' : '#dc2626',
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
