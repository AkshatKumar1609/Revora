import React from 'react';

export default function InsightsPanel({ marketing, improvements }) {
  const { positive_rate, negative_rate, summary } = marketing ?? {};
  const items = improvements ?? [];

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Marketing insights */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Marketing Snapshot</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-zinc-200 rounded-md px-3 py-3 text-center">
              <p className="text-xl font-semibold text-emerald-600">{positive_rate ?? '—'}</p>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">Satisfaction</p>
            </div>
            <div className="border border-zinc-200 rounded-md px-3 py-3 text-center">
              <p className="text-xl font-semibold text-red-500">{negative_rate ?? '—'}</p>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">Dissatisfied</p>
            </div>
          </div>
          {summary && (
            <p className="text-[12px] text-zinc-500 leading-relaxed border-t border-zinc-100 pt-3">
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Improvements */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Improvement Areas
          </p>
          {items.length > 0 && (
            <span className="ml-auto text-[10px] font-mono bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
              {items.length}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[12px] text-zinc-400">No critical issues identified.</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-50">
            {items.map((item, i) => (
              <li key={i} className="px-4 py-3 hover:bg-zinc-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.negative}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-zinc-800 capitalize">{item.feature}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{item.suggestion}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded">
                        +{item.positive}
                      </span>
                      <span className="text-[10px] font-mono bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded">
                        −{item.negative}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 px-1 py-0.5">
                        {item.mentions} total
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
