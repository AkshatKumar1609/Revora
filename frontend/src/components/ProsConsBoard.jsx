import React from 'react';

export default function ProsConsBoard({ pros, cons }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Board items={pros} type="pro" />
      <Board items={cons} type="con" />
    </div>
  );
}

function Board({ items, type }) {
  const isPro = type === 'pro';

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${
        isPro ? 'border-emerald-100 bg-emerald-50' : 'border-red-100 bg-red-50'
      }`}>
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${
          isPro ? 'text-emerald-700' : 'text-red-700'
        }`}>
          {isPro ? 'Pros' : 'Cons'}
        </span>
        <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border ${
          isPro
            ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
            : 'bg-red-100 text-red-600 border-red-200'
        }`}>
          {items?.length ?? 0} phrases
        </span>
      </div>

      {/* Item list */}
      {items && items.length > 0 ? (
        <ul className="divide-y divide-zinc-50">
          {items.map((phrase, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors">
              <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${
                isPro
                  ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                  : 'bg-red-50 text-red-400 border border-red-100'
              }`}>
                {i + 1}
              </span>
              <span className="text-[13px] text-zinc-700 leading-snug">{phrase}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-8 text-center text-[12px] text-zinc-400">No data.</p>
      )}
    </div>
  );
}
