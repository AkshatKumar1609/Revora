import { useState, useCallback } from 'react';

const STORAGE_KEY = 'revora_history';
const MAX_ENTRIES = 20;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function save(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/**
 * Manages a capped list of past analyses in localStorage.
 * Each entry: { id, url, timestamp, verdict, total_reviews, avg_rating, data }
 */
export function useHistory() {
  const [history, setHistory] = useState(() => load());

  const addEntry = useCallback((url, apiData) => {
    const entry = {
      id:            crypto.randomUUID(),
      url,
      timestamp:     new Date().toISOString(),
      verdict:       apiData.verdict,
      total_reviews: apiData.total_reviews,
      avg_rating:    apiData.average_rating,
      data:          apiData,          // full payload for restore
    };

    setHistory(prev => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      save(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
