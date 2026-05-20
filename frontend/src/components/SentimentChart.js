import React from 'react';
import { Pie, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

const SentimentChart = ({ data }) => {
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
        data: values,
        backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
        borderColor: ['#388e3c', '#c62828', '#757575'],
        borderWidth: 2,
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
  };

  return <Pie data={chartData} options={options} />;
};

export default SentimentChart;
