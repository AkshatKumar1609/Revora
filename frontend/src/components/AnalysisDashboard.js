import React from 'react';
import SentimentChart from './SentimentChart';
import RatingHistogramChart from './RatingHistogramChart';
import EmotionRadarChart from './EmotionRadarChart';
import AspectSentimentChart from './AspectSentimentChart';
import ProsConsList from './ProsConsList';
import InsightsPanel from './InsightsPanel';
import './AnalysisDashboard.css';

const AnalysisDashboard = ({ data }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Analysis Results</h2>
        <button className="reset-btn" onClick={() => window.location.reload()}>
          ← Analyze Another Product
        </button>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <h4>Total Reviews Analyzed</h4>
          <p className="metric-value">{data.total_reviews}</p>
        </div>
        <div className="metric-card">
          <h4>Overall Verdict</h4>
          <p className="metric-value verdict">{data.verdict.grade}</p>
          <p className="metric-subtext">Score: {data.verdict.score}/100</p>
        </div>
        <div className="metric-card">
          <h4>Average Rating</h4>
          <p className="metric-value">
            {data.average_rating ? data.average_rating.toFixed(1) : 'N/A'}
          </p>
          <p className="metric-subtext">out of 5</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Sentiment Distribution</h3>
          <div className="chart-container">
            <SentimentChart data={data.sentiment_distribution} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Rating Histogram</h3>
          <div className="chart-container">
            <RatingHistogramChart data={data.rating_histogram} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Emotion Breakdown</h3>
          <div className="chart-container">
            <EmotionRadarChart data={data.emotion_distribution} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Aspect Sentiment Analysis</h3>
          <div className="chart-container">
            <AspectSentimentChart data={data.aspect_sentiment_radar} />
          </div>
        </div>
      </div>

      <ProsConsList pros={data.pros} cons={data.cons} />

      <InsightsPanel
        marketingInsights={data.marketing_insights}
        productImprovements={data.product_improvements}
        frequentlyMentionedFeatures={data.frequently_mentioned_features}
      />
    </div>
  );
};

export default AnalysisDashboard;
