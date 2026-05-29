import React from 'react';
import VerdictCard      from './VerdictCard';
import SentimentChart   from './SentimentChart';
import RatingChart      from './RatingChart';
import ProsCons         from './ProsCons';
import AspectRadar      from './AspectRadar';
import EmotionChart     from './EmotionChart';
import FeaturesChart    from './FeaturesChart';
import MarketingCard    from './MarketingCard';
import ImprovementsCard from './ImprovementsCard';

function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <span className="section-label-text">{children}</span>
      <div className="section-label-line" />
    </div>
  );
}

export default function Dashboard({ data, url, onReset }) {
  const {
    total_reviews,
    verdict,
    sentiment_distribution,
    average_rating,
    rating_histogram,
    pros,
    cons,
    aspect_sentiment_radar,
    emotion_distribution,
    frequently_mentioned_features,
    marketing_insights,
    product_improvements,
  } = data;

  const posCount = sentiment_distribution.positive ?? 0;
  const negCount = sentiment_distribution.negative ?? 0;

  return (
    <div className="dashboard">
      {/* ── Sticky top bar ── */}
      <div className="dash-topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <span className="topbar-logo-mark">◈</span>
            Revora
          </div>
          <div className="topbar-sep" />
          <span className="topbar-url">{url}</span>
        </div>
        <button className="new-btn" onClick={onReset}>
          ← New Analysis
        </button>
      </div>

      <div className="dash-body">

        {/* ── Stat strip ── */}
        <div className="stat-strip">
          <div className="stat-tile" style={{ '--accent-color': '#a855f7' }}>
            <span className="stat-tile-num">{total_reviews}</span>
            <span className="stat-tile-label">Reviews analyzed</span>
          </div>
          <div className="stat-tile" style={{ '--accent-color': '#10b981' }}>
            <span className="stat-tile-num green">{posCount}</span>
            <span className="stat-tile-label">Positive</span>
          </div>
          <div className="stat-tile" style={{ '--accent-color': '#ef4444' }}>
            <span className="stat-tile-num red">{negCount}</span>
            <span className="stat-tile-label">Negative</span>
          </div>
          <div className="stat-tile" style={{ '--accent-color': '#f59e0b' }}>
            <span className="stat-tile-num amber">
              {average_rating != null ? `${average_rating}★` : '—'}
            </span>
            <span className="stat-tile-label">Avg rating</span>
          </div>
        </div>

        {/* ── Overview ── */}
        <SectionLabel>Overview</SectionLabel>
        <div className="grid-3">
          <VerdictCard verdict={verdict} />
          <SentimentChart distribution={sentiment_distribution} total={total_reviews} />
          <RatingChart histogram={rating_histogram} avgRating={average_rating} />
        </div>

        {/* ── Buyer Feedback ── */}
        <SectionLabel>Buyer Feedback</SectionLabel>
        <div className="grid-2">
          <ProsCons items={pros} type="pro" />
          <ProsCons items={cons} type="con" />
        </div>

        {/* ── Deep Analysis ── */}
        <SectionLabel>Deep Analysis</SectionLabel>
        <div className="grid-2">
          <AspectRadar radar={aspect_sentiment_radar} />
          <EmotionChart emotions={emotion_distribution} />
        </div>

        {/* ── Topic Intelligence ── */}
        <SectionLabel>Topic Intelligence</SectionLabel>
        <div className="grid-1">
          <FeaturesChart features={frequently_mentioned_features} />
        </div>

        {/* ── Strategy ── */}
        <SectionLabel>Strategy</SectionLabel>
        <div className="grid-2">
          <MarketingCard insights={marketing_insights} />
          <ImprovementsCard improvements={product_improvements} />
        </div>

        <footer className="dash-footer">
          Revora — Review Intelligence &nbsp;·&nbsp; {total_reviews} reviews processed
        </footer>

      </div>
    </div>
  );
}
