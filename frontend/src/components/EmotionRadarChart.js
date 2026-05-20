import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const EmotionRadarChart = ({ data }) => {
  // Helper to extract numeric values from data (handles objects and primitives)
  const extractValue = (val) => {
    if (typeof val === 'object' && val !== null) {
      return val.count !== undefined ? val.count : (val.mentions !== undefined ? val.mentions : 0);
    }
    return Number(val) || 0;
  };

  const labels = Object.keys(data);
  const values = labels.map(key => extractValue(data[key]));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Emotion Distribution',
        data: values,
        borderColor: '#1a73e8',
        backgroundColor: 'rgba(26, 115, 232, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#1a73e8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  return <Radar data={chartData} options={options} />;
};

export default EmotionRadarChart;
