import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

export const makeChart = (period, stock, chartInstance, chartRef, isGreen) => {
    // Check if chartInstance.current exists and has a destroy method
    if (chartInstance.current && typeof chartInstance.current.destroy === 'function') {
        chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    const themeRed = getComputedStyle(document.documentElement).getPropertyValue('--theme-red').trim()
    const lightGrey = getComputedStyle(document.documentElement).getPropertyValue('--text-field-grey').trim()
    const chartColor = isGreen ? themeGreen : themeRed
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
                borderColor: chartColor,
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
                            borderColor: lightGrey,
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



export const makeChartSmall = (period, stock, chartInstance, chartRef, isGreen) => {
    // console.log('Creating chart for symbol:', stock)
    if (chartInstance && chartInstance.current) {
        chartInstance.current.destroy()
    }
    // Set the canvas size to 50% of its original size
    chartRef.width = chartRef.width / 2
    chartRef.height = chartRef.height / 2

    const ctx = chartRef.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    const themeRed = getComputedStyle(document.documentElement).getPropertyValue('--theme-red').trim()
    const lightGrey = getComputedStyle(document.documentElement).getPropertyValue('--text-field-grey').trim() 
    const chartColor = isGreen ? themeGreen: themeRed
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
                borderColor: chartColor,
                fill: false,
                borderWidth: 2,
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
                            borderColor: lightGrey,
                            borderWidth: 1,
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

