import React, { useState } from 'react';

export default function Hero({ onAnalyze, disabled }) {
  const [url, setUrl] = useState('');
  const [maxReviews, setMax] = useState(100);

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim(), maxReviews);
  }

  return (
    <header className="hero">
      {/* Decorative backgrounds */}
      <div className="hero-aurora" />
      <div className="hero-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-glyph">◈</span>
          <span>Revora</span>
        </div>
        <div className="nav-status">
          <div className="status-dot" />
          Review Intelligence
        </div>
      </nav>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-line" />
          Instant Review Analysis
          <span className="eyebrow-line" />
        </div>

        <h1 className="hero-title">Decode what buyers</h1>
        <div className="hero-title-sub">
          <span className="gradient-text">really think</span>
        </div>

        <p className="hero-desc">
          Paste any product review URL and get a full sentiment breakdown,
          emotion mapping, pros &amp; cons, and actionable product insights.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          {/* URL field */}
          <div className="url-field">
            <span className="url-icon">🔗</span>
            <input
              id="productUrl"
              type="url"
              className="url-input"
              placeholder="Paste product URL here…"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {/* Slider + button */}
          <div className="form-row">
            <div className="slider-wrap">
              <span className="slider-label">Max reviews</span>
              <input
                id="maxReviewsSlider"
                type="range"
                className="rev-slider"
                min={10}
                max={1000}
                step={10}
                value={maxReviews}
                onChange={e => setMax(Number(e.target.value))}
              />
              <span className="slider-val">{maxReviews}</span>
            </div>

            <button
              type="submit"
              id="analyzeBtn"
              className="analyze-btn"
              disabled={disabled}
            >
              <span>{disabled ? 'Analyzing…' : 'Analyze'}</span>
              <span className="btn-arrow">{disabled ? '⏳' : '→'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </header>
  );
}
