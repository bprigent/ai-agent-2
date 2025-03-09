import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './PieChartMessageAI.scss';
import { getTimeAgo } from '../../helperfunctions/getTimeAgo';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChartMessageAI = ({ message }) => {
    const { categoryList, valueList, metric } = message.content;

    const data = {
        labels: categoryList,
        datasets: [
            {
                data: valueList,
                backgroundColor: [
                    '#635BFF',
                    '#9A66FF', 
                    '#11EEE3',
                    '#00D924',
                ],
                borderColor: [
                    '#635BFF',
                    '#9A66FF', 
                    '#11EEE3',
                    '#00D924',   
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: '500'
                    },
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        const total = datasets[0].data.reduce((acc, curr) => acc + curr, 0);
                        
                        return chart.data.labels.map((label, i) => {
                            const value = datasets[0].data[i];
                            const percentage = ((value / total) * 100).toFixed(1);
                            return {
                                text: `${label} - ${value}${metric} (${percentage}%)`,
                                fillStyle: datasets[0].backgroundColor[i],
                                hidden: false,
                                lineCap: 'round',
                                lineDash: [],
                                lineDashOffset: 0,
                                lineWidth: 0,
                                strokeStyle: datasets[0].backgroundColor[i],
                                pointStyle: 'circle',
                                index: i
                            };
                        });
                    }
                },  
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value}${metric} (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                color: '#FFFFFF',
                font: {
                    weight: 'bold',
                    size: 14
                },
                textAlign: 'center',
                formatter: (value, ctx) => {
                    const total = ctx.dataset.data.reduce((acc, curr) => acc + curr, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return [`${percentage}%`];
                },
                display: function(context) {
                    return context.dataset.data[context.dataIndex] > 0;
                }
            }
        },
        layout: {
            padding: {
                top: 12,
                bottom: 6,
                left: 12,
                right: 12
            }
        },
        animation: {
            animateRotate: false,
            animateScale: false,
        }
    };

    return (
        <div className="pie_message_ai-parent_w">
            <div className="pie_message_ai-child_w">
                <Pie data={data} options={options} />
            </div>
            <span className="pie_message_ai-date">
                Sent {getTimeAgo(message.date)}
            </span>
        </div>
    );
};

export default PieChartMessageAI;
