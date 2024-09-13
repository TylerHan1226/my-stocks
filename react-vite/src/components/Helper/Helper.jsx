import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

export const makeChart = (period, stock, chartInstance, chartRef) => {
    if (chartInstance.current) {
        chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    let annotationValue

    if (period === 'historical_data_1d') {
        annotationValue = stock?.info?.previousClose
    } else if (['historical_data_1wk', 'historical_data_1mo', 'historical_data_3mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr', 'historical_data_ytd'].includes(period)) {
        annotationValue = stock[period]?.[0]
    }

    if (annotationValue === undefined || annotationValue === null) {
        console.error('Annotation value is not defined')
        return
    }

    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(stock[period]?.length).fill(''),
            datasets: [{
                data: stock[period],
                borderColor: themeGreen,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: true },
                y: { display: true }
            },
            elements: {
                point: { radius: 0 }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: annotationValue,
                            yMax: annotationValue,
                            borderColor: 'rgba(75, 192, 192, 0.4)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                content: 'Annotation Line',
                                enabled: true,
                                position: 'end'
                            }
                        }
                    }
                }
            }
        }
    })
}



export const makeChartSmall = (period, stock, chartInstance, chartRef) => {
    if (chartInstance && chartInstance.current) {
        chartInstance.current.destroy()
    }
    // Set the canvas size to 50% of its original size
    chartRef.width = chartRef.width / 2
    chartRef.height = chartRef.height / 2

    const ctx = chartRef.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    let annotationValue

    if (period === 'historical_data_1d') {
        annotationValue = stock?.info?.previousClose
    } else if (['historical_data_1wk', 'historical_data_1mo', 'historical_data_3mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr', 'historical_data_ytd'].includes(period)) {
        annotationValue = stock[period]?.[0]
    }

    if (annotationValue === undefined || annotationValue === null) {
        console.error('Annotation value is not defined')
        return
    }

    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(stock[period]?.length).fill(''),
            datasets: [{
                data: stock[period],
                borderColor: themeGreen,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                point: { radius: 0 }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: annotationValue,
                            yMax: annotationValue,
                            borderColor: 'rgba(75, 192, 192, 0.4)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                content: 'Annotation Line',
                                enabled: true,
                                position: 'end'
                            }
                        }
                    }
                }
            }
        }
    })
}

