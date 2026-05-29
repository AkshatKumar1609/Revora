import React, { useState } from 'react';

const GRADE_COLORS = {
  A: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  B: 'text-sky-700 bg-sky-50 border-sky-200',
  C: 'text-amber-700 bg-amber-50 border-amber-200',
  D: 'text-orange-700 bg-orange-50 border-orange-200',
  F: 'text-red-700 bg-red-50 border-red-200',
};

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryView({ history, onLoad, onRemove, onClear }) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-10 h-10 rounded-lg border border-zinc-200 bg-white flex items-center justify-center mb-4">
          <span className="text-zinc-400 text-base">○</span>
        </div>
        <p className="text-sm font-medium text-zinc-800 mb-1">No history yet</p>
        <p className="text-xs text-zinc-400 max-w-xs">
          Completed analyses are automatically saved here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[13px] font-semibold text-zinc-900">Past Analyses</h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {history.length} saved {history.length === 1 ? 'entry' : 'entries'} — stored locally in your browser
          </p>
        </div>
        <div className="flex items-center gap-2">
          {confirmClear ? (
            <>
              <span className="text-[11px] text-zinc-500">Are you sure?</span>
              <button
                onClick={() => { onClear(); setConfirmClear(false); }}
                className="text-[11px] text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Yes, clear all
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-[11px] text-zinc-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">URL</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Grade</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Score</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Reviews</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Rating</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">When</th>
              <th className="px-4 py-2.5 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {history.map(entry => {
              const grade = entry.verdict?.grade ?? '—';
              const score = entry.verdict?.score ?? '—';
              return (
                <tr
                  key={entry.id}
                  className="hover:bg-zinc-50 transition-colors group"
                >
                  {/* URL */}
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-mono text-zinc-700 truncate text-[11px]" title={entry.url}>
                      {entry.url}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(entry.timestamp)}</p>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold border rounded ${GRADE_COLORS[grade] ?? 'text-zinc-500 bg-zinc-50 border-zinc-200'}`}>
                      {grade}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3 text-right font-mono text-zinc-900 font-medium">
                    {score}
                    <span className="text-zinc-400 font-normal">/100</span>
                  </td>

                  {/* Reviews */}
                  <td className="px-4 py-3 text-right font-mono text-zinc-600">
                    {entry.total_reviews ?? '—'}
                  </td>

                  {/* Avg rating */}
                  <td className="px-4 py-3 text-right font-mono text-zinc-600">
                    {entry.avg_rating != null ? `${entry.avg_rating}★` : '—'}
                  </td>

                  {/* When */}
                  <td className="px-4 py-3 text-right text-zinc-400 whitespace-nowrap">
                    {timeAgo(entry.timestamp)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onLoad(entry)}
                        className="text-[11px] text-zinc-600 hover:text-zinc-900 font-medium transition-colors whitespace-nowrap"
                      >
                        Load →
                      </button>
                      <button
                        onClick={() => onRemove(entry.id)}
                        className="text-[11px] text-zinc-300 hover:text-red-500 transition-colors"
                        title="Remove this entry"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] text-zinc-400 text-center">
        Stored in browser localStorage · Cleared when you clear browser data
      </p>

    </div>
  );
}
