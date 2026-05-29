import React, { useRef, useEffect } from 'react';
import VerdictSummary   from './VerdictSummary';
import SentimentSection from './SentimentSection';
import ProsConsBoard    from './ProsConsBoard';
import AspectTable      from './AspectTable';
import EmotionTable     from './EmotionTable';
import FeaturesTable    from './FeaturesTable';
import InsightsPanel    from './InsightsPanel';

const SECTIONS = ['overview', 'sentiment', 'feedback', 'features', 'insights'];

export default function ResultsView({ data, url, activeSection, onSectionChange }) {
  const refs = useRef({});

  // Scroll to section when sidebar nav changes
  useEffect(() => {
    const el = refs.current[activeSection];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeSection]);

  // Intersection observer to update sidebar active state on scroll
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(id => {
      const el = refs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onSectionChange(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [onSectionChange]);

  const {
    total_reviews, verdict, sentiment_distribution, average_rating,
    rating_histogram, pros, cons, aspect_sentiment_radar,
    emotion_distribution, frequently_mentioned_features,
    marketing_insights, product_improvements,
  } = data;

  return (
    <div className="p-6 space-y-6 max-w-5xl">

      {/* URL breadcrumb */}
      <div className="flex items-center gap-2 py-1">
        <span className="text-[11px] text-zinc-400 font-mono truncate">{url}</span>
        <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
          {total_reviews} reviews
        </span>
      </div>

      {/* Overview */}
      <section ref={el => refs.current['overview'] = el} id="overview">
        <SectionHeader>Overview</SectionHeader>
        <VerdictSummary
          verdict={verdict}
          totalReviews={total_reviews}
          avgRating={average_rating}
          distribution={sentiment_distribution}
        />
      </section>

      {/* Sentiment */}
      <section ref={el => refs.current['sentiment'] = el} id="sentiment">
        <SectionHeader>Sentiment</SectionHeader>
        <SentimentSection
          distribution={sentiment_distribution}
          total={total_reviews}
          histogram={rating_histogram}
          avgRating={average_rating}
        />
      </section>

      {/* Buyer Feedback */}
      <section ref={el => refs.current['feedback'] = el} id="feedback">
        <SectionHeader>Buyer Feedback</SectionHeader>
        <ProsConsBoard pros={pros} cons={cons} />
      </section>

      {/* Features */}
      <section ref={el => refs.current['features'] = el} id="features">
        <SectionHeader>Feature Analysis</SectionHeader>
        <div className="grid grid-cols-2 gap-4">
          <AspectTable radar={aspect_sentiment_radar} />
          <EmotionTable emotions={emotion_distribution} />
        </div>
        <div className="mt-4">
          <FeaturesTable features={frequently_mentioned_features} />
        </div>
      </section>

      {/* Insights */}
      <section ref={el => refs.current['insights'] = el} id="insights">
        <SectionHeader>Insights</SectionHeader>
        <InsightsPanel
          marketing={marketing_insights}
          improvements={product_improvements}
        />
      </section>

    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">
        {children}
      </h2>
      <div className="flex-1 border-t border-zinc-200" />
    </div>
  );
}
