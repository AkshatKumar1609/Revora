import React, { useEffect, useState } from 'react';

const PIPELINE_STEPS = [
  'Connecting to target host…',
  'Scraping target DOM elements…',
  'Parsing review nodes…',
  'Running sentiment classification…',
  'Computing aspect scores…',
  'Building report…',
];

function SkeletonRect({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export default function SkeletonLoader() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx(i => Math.min(i + 1, PIPELINE_STEPS.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-lg">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
        <span className="text-[12px] font-mono text-zinc-500 tracking-wide">
          {PIPELINE_STEPS[stepIdx]}
        </span>
        <span className="ml-auto text-[11px] text-zinc-300">
          {stepIdx + 1} / {PIPELINE_STEPS.length}
        </span>
      </div>

      {/* Skeleton — mimics the stat row */}
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-lg p-4 space-y-2">
            <SkeletonRect className="h-6 w-10" />
            <SkeletonRect className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Skeleton — mimics 3-column row */}
      <div className="grid grid-cols-3 gap-4">
        {[180, 160, 160].map((h, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
            <SkeletonRect className="h-3 w-24" />
            <SkeletonRect className={`w-full`} style={{ height: h }} />
          </div>
        ))}
      </div>

      {/* Skeleton — mimics 2-column row */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-lg p-4 space-y-2">
            <SkeletonRect className="h-3 w-20" />
            {[...Array(5)].map((_, j) => (
              <SkeletonRect key={j} className="h-7 w-full" />
            ))}
          </div>
        ))}
      </div>

      {/* Skeleton — full-width */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
        <SkeletonRect className="h-3 w-32" />
        <SkeletonRect className="h-48 w-full" />
      </div>
    </div>
  );
}
