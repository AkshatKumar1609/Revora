import React, { useState, useRef } from 'react';
import './index.css';
import { useHistory }   from './hooks/useHistory';
import Sidebar          from './components/Sidebar';
import InputPanel       from './components/InputPanel';
import SkeletonLoader   from './components/SkeletonLoader';
import ErrorPanel       from './components/ErrorPanel';
import ResultsView      from './components/ResultsView';
import HistoryView      from './components/HistoryView';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [status,        setStatus]        = useState('idle');  // idle | loading | done | error | history
  const [data,          setData]          = useState(null);
  const [url,           setUrl]           = useState('');
  const [error,         setError]         = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const abortRef = useRef(null);

  const { history, addEntry, removeEntry, clearHistory } = useHistory();

  /* ── Analyze ─────────────────────────────────────────────────── */
  async function handleAnalyze(productUrl, maxReviews) {
    setUrl(productUrl);
    setStatus('loading');
    setError('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url: productUrl, max_reviews: Number(maxReviews) }),
        signal:  controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Server responded with ${res.status}`);
      }

      const json = await res.json();
      addEntry(productUrl, json);   // ← persist to localStorage
      setData(json);
      setStatus('done');
      setActiveSection('overview');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  }

  /* ── Restore from history ─────────────────────────────────────── */
  function handleLoadHistory(entry) {
    setUrl(entry.url);
    setData(entry.data);
    setStatus('done');
    setActiveSection('overview');
  }

  /* ── Reset ────────────────────────────────────────────────────── */
  function handleReset() {
    abortRef.current?.abort();
    setStatus('idle');
    setData(null);
    setUrl('');
    setError('');
  }

  /* ── Toggle history view ─────────────────────────────────────── */
  function handleToggleHistory() {
    setStatus(s => s === 'history' ? 'idle' : 'history');
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar
        status={status}
        activeSection={activeSection}
        historyCount={history.length}
        onSectionChange={setActiveSection}
        onReset={handleReset}
        onToggleHistory={handleToggleHistory}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InputPanel
          onAnalyze={handleAnalyze}
          loading={status === 'loading'}
          currentUrl={url}
        />

        <div className="flex-1 overflow-y-auto">

          {status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-10 h-10 rounded-lg border border-zinc-200 bg-white flex items-center justify-center mb-4">
                <span className="text-zinc-400 text-lg">◈</span>
              </div>
              <p className="text-sm font-medium text-zinc-800 mb-1">No analysis yet</p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Paste a product review URL above and click Analyze to generate a full report.
              </p>
              {history.length > 0 && (
                <button
                  onClick={handleToggleHistory}
                  className="mt-5 text-xs text-zinc-500 hover:text-zinc-800 underline underline-offset-2 transition-colors"
                >
                  View {history.length} saved {history.length === 1 ? 'analysis' : 'analyses'} →
                </button>
              )}
            </div>
          )}

          {status === 'loading'  && <SkeletonLoader />}
          {status === 'error'    && <ErrorPanel message={error} onRetry={handleReset} />}

          {status === 'history'  && (
            <HistoryView
              history={history}
              onLoad={handleLoadHistory}
              onRemove={removeEntry}
              onClear={clearHistory}
            />
          )}

          {status === 'done' && data && (
            <ResultsView
              data={data}
              url={url}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          )}

        </div>
      </main>
    </div>
  );
}
