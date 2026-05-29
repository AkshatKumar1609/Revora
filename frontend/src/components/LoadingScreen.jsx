import React, { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Fetching reviews from source' },
  { label: 'Running sentiment analysis' },
  { label: 'Building visual insights' },
];

export default function LoadingScreen() {
  const [activeStep, setActive] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActive(1), 3500);
    const t2 = setTimeout(() => setActive(2), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loader-inner">
        <div className="loader-ring" />
        <p className="loader-heading">Analyzing reviews…</p>
        <div className="loader-steps">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`loader-step ${
                i < activeStep ? 'done' : i === activeStep ? 'active' : ''
              }`}
            >
              {i < activeStep ? `✓  ${s.label}` : `${i === activeStep ? '↻' : '○'}  ${s.label}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
