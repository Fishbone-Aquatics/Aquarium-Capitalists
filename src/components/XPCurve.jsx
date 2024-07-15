import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Function to calculate XP
const calculateXP = (n) => {
    const A = 100; // Starting point for level 1
    const B = Math.pow((200000000 + A) / A, 1 / 100); // Growth factor
    return A * (Math.pow(B, n) - 1);
};

const XPCurve = () => {
    const levels = Array.from({ length: 100 }, (_, i) => i + 1);
    const xpValues = levels.map(calculateXP);

    const data = {
        labels: levels,
        datasets: [
            {
                label: 'XP Curve',
                data: xpValues,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Level',
                },
                type: 'category',
            },
            y: {
                title: {
                    display: true,
                    text: 'XP',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>XP Curve for Levels 1-100</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default XPCurve;
