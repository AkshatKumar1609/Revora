import React from 'react';

const NAV = [
  { id: 'overview',  label: 'Overview',        icon: '▣' },
  { id: 'sentiment', label: 'Sentiment',        icon: '◑' },
  { id: 'feedback',  label: 'Buyer Feedback',   icon: '◧' },
  { id: 'features',  label: 'Feature Analysis', icon: '⊞' },
  { id: 'insights',  label: 'Insights',         icon: '◎' },
];

export default function Sidebar({
  status,
  activeSection,
  historyCount,
  onSectionChange,
  onReset,
  onToggleHistory,
}) {
  const hasDone    = status === 'done';
  const isHistory  = status === 'history';

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <span className="text-zinc-900 font-semibold tracking-tight text-sm">Revora</span>
        <p className="text-[11px] text-zinc-400 mt-0.5 tracking-wide">Review Intelligence</p>
      </div>

      {/* ── Workspace nav ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 py-1.5 text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
          Workspace
        </p>

        {NAV.map(item => {
          const isActive  = hasDone && activeSection === item.id;
          const isEnabled = hasDone;
          return (
            <button
              key={item.id}
              onClick={() => isEnabled && onSectionChange(item.id)}
              disabled={!isEnabled}
              className={`
                w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-left
                transition-colors duration-100
                ${isActive
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : isEnabled
                    ? 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
                    : 'text-zinc-300 cursor-not-allowed'
                }
              `}
            >
              <span className="text-[11px] opacity-60">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Status footer ── */}
      {status === 'loading' && (
        <div className="px-4 py-2.5 border-t border-zinc-100 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-[11px] text-zinc-400">Processing…</span>
        </div>
      )}
      {hasDone && (
        <div className="px-4 py-2.5 border-t border-zinc-100">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-[11px] text-zinc-400">Analysis complete</span>
          </div>
          <button
            onClick={onReset}
            className="text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← New analysis
          </button>
        </div>
      )}

      {/* ── History section ── */}
      <div className="px-2 py-3 border-t border-zinc-100">
        <p className="px-2 py-1 text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
          History
        </p>
        <button
          onClick={onToggleHistory}
          className={`
            w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-left
            transition-colors duration-100
            ${isHistory
              ? 'bg-zinc-100 text-zinc-900 font-medium'
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
            }
          `}
        >
          <span className="text-[11px] opacity-60">○</span>
          Past Analyses
          {historyCount > 0 && (
            <span className="ml-auto text-[10px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200">
              {historyCount}
            </span>
          )}
        </button>
      </div>

    </aside>
  );
}
