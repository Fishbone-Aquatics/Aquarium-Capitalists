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

const calculateXP = (n) => {
    if (n <= 30) {
        // Polynomial function for levels 1-30
        const a = 3e6 / Math.pow(30, 2); // a = 3,000,000 / 900
        return a * Math.pow(n, 2);
    } else {
        // Exponential function for levels 31-100
        const C = 3e6; // XP at level 30
        const D = (200e6 - C) / Math.pow(70, 2); // Growth rate for levels 31-100
        return C + D * Math.pow(n - 30, 2);
    }
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
