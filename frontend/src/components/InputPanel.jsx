import React, { useState } from 'react';

export default function InputPanel({ onAnalyze, loading, currentUrl }) {
  const [url,        setUrl]    = useState('');
  const [maxReviews, setMax]    = useState(100);
  const [error,      setUrlErr] = useState('');

  function validate(val) {
    if (!val.trim()) return 'URL is required.';
    try { new URL(val.trim()); } catch { return 'Enter a valid URL.'; }
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate(url);
    if (err) { setUrlErr(err); return; }
    setUrlErr('');
    onAnalyze(url.trim(), maxReviews);
  }

  return (
    <div className="bg-white border-b border-zinc-200 px-6 py-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          {/* URL Input */}
          <div className="flex-1 min-w-0">
            <label htmlFor="productUrl" className="block text-[11px] font-medium text-zinc-500 mb-1.5 tracking-wide uppercase">
              Product Review URL
            </label>
            <input
              id="productUrl"
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setUrlErr(''); }}
              placeholder="https://…/product-reviews/…"
              autoComplete="off"
              spellCheck="false"
              className={`
                w-full h-9 px-3 text-[13px] text-zinc-900 placeholder-zinc-400
                bg-white border rounded-md outline-none font-mono
                transition-colors duration-100
                ${error
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                  : 'border-zinc-300 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200'
                }
              `}
            />
            {error
              ? <p className="mt-1 text-[11px] text-red-500">{error}</p>
              : <p className="mt-1 text-[11px] text-zinc-400">Supports any platform review URL.</p>
            }
          </div>

          {/* Max reviews */}
          <div className="flex-shrink-0 w-36">
            <label htmlFor="maxReviews" className="block text-[11px] font-medium text-zinc-500 mb-1.5 tracking-wide uppercase">
              Max Reviews
            </label>
            <div className="flex items-center gap-2">
              <input
                id="maxReviews"
                type="number"
                min={10} max={1000} step={10}
                value={maxReviews}
                onChange={e => setMax(Number(e.target.value))}
                className="w-full h-9 px-3 text-[13px] text-zinc-900 bg-white border border-zinc-300 rounded-md outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200 transition-colors"
              />
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">10 – 1000</p>
          </div>

          {/* Submit */}
          <div className="flex-shrink-0 pt-[22px]">
            <button
              type="submit"
              id="analyzeBtn"
              disabled={loading}
              className="h-9 px-4 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-300 text-white text-[13px] font-medium rounded-md transition-colors duration-100 whitespace-nowrap flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing
                </>
              ) : (
                'Analyze →'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
