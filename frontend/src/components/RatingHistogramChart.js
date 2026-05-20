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

const RatingHistogramChart = ({ data }) => {
  // Helper to extract numeric values from data (handles objects and primitives)
  const extractValue = (val) => {
    if (typeof val === 'object' && val !== null) {
      return val.count !== undefined ? val.count : (val.mentions !== undefined ? val.mentions : 0);
    }
    return Number(val) || 0;
  };

  const labels = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
  const values = [
    extractValue(data['1']),
    extractValue(data['2']),
    extractValue(data['3']),
    extractValue(data['4']),
    extractValue(data['5']),
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Reviews',
        data: values,
        backgroundColor: ['#f44336', '#ff9800', '#ffc107', '#8bc34a', '#4caf50'],
        borderColor: ['#c62828', '#e65100', '#f57f17', '#558b2f', '#2e7d32'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default RatingHistogramChart;
