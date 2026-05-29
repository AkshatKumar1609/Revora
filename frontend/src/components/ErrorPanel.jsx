import React from 'react';

export default function ErrorPanel({ message, onRetry }) {
  return (
    <div className="flex items-start justify-center pt-16 px-8">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-100">
          <div className="w-7 h-7 rounded bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-xs">!</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-zinc-900">Request Failed</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">The analysis pipeline returned an error.</p>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded px-3 py-2 mb-5">
          <p className="font-mono text-[12px] text-red-600 break-words">{message}</p>
        </div>

        <button
          onClick={onRetry}
          className="w-full h-8 bg-zinc-900 hover:bg-zinc-700 text-white text-[12px] font-medium rounded-md transition-colors"
        >
          ← Try another URL
        </button>
      </div>
    </div>
  );
}
