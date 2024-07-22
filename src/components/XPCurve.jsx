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
import { calculateXPForLevel } from '../utils/xpUtils';

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

const XPCurve = () => {
    const levels = Array.from({ length: 100 }, (_, i) => i + 1);
    const xpValues = levels.map(calculateXPForLevel);

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
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.raw !== null) {
                            label += new Intl.NumberFormat('en-US').format(Math.round(context.raw));
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div>
            <h2>XP Curve for Levels 1-100</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default XPCurve;
