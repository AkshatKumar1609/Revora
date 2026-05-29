import React from 'react';

const EMOTION_CONFIG = {
  excitement:     { emoji: '🤩', color: '#f59e0b' },
  joy:            { emoji: '😊', color: '#10b981' },
  satisfaction:   { emoji: '😌', color: '#06b6d4' },
  neutral:        { emoji: '😐', color: '#6366f1' },
  disappointment: { emoji: '😕', color: '#f97316' },
  frustration:    { emoji: '😤', color: '#ef4444' },
  anger:          { emoji: '😡', color: '#dc2626' },
};

export default function EmotionTable({ emotions }) {
  const entries = Object.entries(emotions ?? {}).sort(([, a], [, b]) => b - a);
  const max = entries[0]?.[1] ?? 1;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Emotion Distribution
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">% of reviews per dominant emotion</p>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-8 text-center text-[12px] text-zinc-400">No data.</p>
      ) : (
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Emotion</th>
              <th className="px-4 py-2 text-right text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">%</th>
              <th className="px-4 py-2 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {entries.map(([emotion, pct]) => {
              const cfg = EMOTION_CONFIG[emotion] ?? { emoji: '•', color: '#6366f1' };
              return (
                <tr key={emotion} className="hover:bg-zinc-50">
                  <td className="px-4 py-2.5 flex items-center gap-2">
                    <span className="text-sm">{cfg.emoji}</span>
                    <span className="text-zinc-700 capitalize">{emotion}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-900 font-medium">{pct}%</td>
                  <td className="px-4 py-2.5">
                    <div className="w-full h-1.5 bg-zinc-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{ width: `${(pct / max) * 100}%`, backgroundColor: cfg.color }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
