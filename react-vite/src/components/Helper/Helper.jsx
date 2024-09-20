import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

export const makeChart = (period, stocksData, chartInstance, chartRef) => {
    if (chartInstance.current && typeof chartInstance.current.destroy === 'function') {
        chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    const themeRed = getComputedStyle(document.documentElement).getPropertyValue('--theme-red').trim()
    const lightGrey = getComputedStyle(document.documentElement).getPropertyValue('--text-field-grey').trim()
    const chartOrange = getComputedStyle(document.documentElement).getPropertyValue('--chart-orange').trim()
    const chartBlue = getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim()
    const chartPink = getComputedStyle(document.documentElement).getPropertyValue('--chart-pink').trim()
    const chartYellow = getComputedStyle(document.documentElement).getPropertyValue('--chart-yellow').trim()
    const chartCyan = getComputedStyle(document.documentElement).getPropertyValue('--chart-cyan').trim()
    const colors = [chartOrange, chartBlue, chartPink, chartCyan, chartYellow]

    const datasets = Object.keys(stocksData).map((stockKey, index) => {
        const stock = stocksData[stockKey]
        const isGreen = stock.currentPrice > stock.info.previousClose
        const chartColor = index === 0 ? (isGreen ? themeGreen : themeRed) : colors[index - 1]
        let annotationValue

        if (period === 'historical_data_1d') {
            annotationValue = stock?.info?.previousClose
        } else if (['historical_data_1wk', 'historical_data_1mo', 'historical_data_3mo', 'historical_data_6mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr'].includes(period)) {
            if (stock[period] && stock[period].length > 0) {
                annotationValue = stock[period][0]
            }
        }

        if (annotationValue === undefined || annotationValue === null) {
            console.error('Annotation value is not defined')
            annotationValue = 0
        }

        // Add currentPrice to the end of the stock[period] array
        if (stock[period] && stock.currentPrice !== undefined) {
            stock[period].push(stock.currentPrice)
        }

        return {
            label: stockKey,
            data: stock[period],
            borderColor: chartColor,
            fill: false,
            borderWidth: 3,
        }
    })

    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(stocksData[Object.keys(stocksData)[0]][period]?.length).fill(''),
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: true },
                y: { display: true },
            },
            elements: {
                point: { radius: 0 },
            },
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: Object.keys(stocksData).length == 1 ? stocksData[Object.keys(stocksData)[0]].info.previousClose : 0,
                            yMax: Object.keys(stocksData).length == 1 ? stocksData[Object.keys(stocksData)[0]].info.previousClose : 0,
                            borderColor: lightGrey,
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                content: 'Annotation Line',
                                enabled: true,
                                position: 'end',
                            },
                        },
                    },
                },
            },
        },
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
    } else if (['historical_data_1wk', 'historical_data_1mo', 'historical_data_3mo', 'historical_data_6mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr'].includes(period)) {
        annotationValue = stock[period]?.[0]
    }

    if (annotationValue === undefined || annotationValue === null) {
        console.error('Annotation value is not defined')
        return
    }
    // Add currentPrice to the end of the stock[period] array
    if (stock[period] && stock.currentPrice !== undefined) {
        stock[period].push(stock.currentPrice)
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

