import React from 'react';

const GRADE_STYLES = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-sky-50 text-sky-700 border-sky-200',
  C: 'bg-amber-50 text-amber-700 border-amber-200',
  D: 'bg-orange-50 text-orange-700 border-orange-200',
  F: 'bg-red-50 text-red-700 border-red-200',
};

function StatCell({ label, value, sub, valueClass = '' }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg px-5 py-4">
      <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mb-1.5">{label}</p>
      <p className={`text-2xl font-semibold text-zinc-900 leading-none ${valueClass}`}>{value}</p>
      {sub && <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function VerdictSummary({ verdict, totalReviews, avgRating, distribution }) {
  const { score, grade, summary } = verdict;
  const pos = distribution.positive ?? 0;
  const neg = distribution.negative ?? 0;
  const neu = distribution.neutral  ?? 0;
  const total = pos + neg + neu || 1;

  return (
    <div className="space-y-3">
      {/* 4-cell stat row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCell label="Composite Score" value={`${score}`} sub="out of 100" />
        <StatCell
          label="Grade"
          value={
            <span className={`inline-block px-2 py-0.5 text-base font-semibold border rounded ${GRADE_STYLES[grade] ?? ''}`}>
              {grade}
            </span>
          }
        />
        <StatCell
          label="Avg Rating"
          value={avgRating != null ? `${avgRating}` : '—'}
          sub={avgRating != null ? 'out of 5 stars' : 'No rating data'}
        />
        <StatCell label="Total Reviews" value={totalReviews} sub="reviews analyzed" />
      </div>

      {/* Summary text */}
      <div className="bg-white border border-zinc-200 rounded-lg px-5 py-3 flex items-start gap-3">
        <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5 flex-shrink-0">Summary</span>
        <p className="text-[13px] text-zinc-600 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
