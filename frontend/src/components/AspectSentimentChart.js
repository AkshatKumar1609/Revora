import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AspectSentimentChart = ({ data }) => {
  // Helper to extract numeric values from data (handles objects and primitives)
  const extractValue = (val) => {
    if (typeof val === 'object' && val !== null) {
      // For aspect sentiment, calculate score from positive/negative counts
      const pos = val.positive || 0;
      const neg = val.negative || 0;
      const total = pos + neg;
      return total > 0 ? Math.round((pos / total) * 100) : 0;
    }
    // Direct numeric value (percentage from backend)
    return Number(val) || 0;
  };

  const labels = Object.keys(data);
  const values = labels.map(key => extractValue(data[key]));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Satisfaction %',
        data: values,
        backgroundColor: values.map((v) =>
          v >= 70 ? '#4caf50' : v >= 40 ? '#ffc107' : '#f44336'
        ),
        borderColor: values.map((v) =>
          v >= 70 ? '#388e3c' : v >= 40 ? '#f57f17' : '#c62828'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        min: 0,
        max: 100,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AspectSentimentChart;
