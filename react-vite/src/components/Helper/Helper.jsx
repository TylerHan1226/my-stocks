import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'

Chart.register(annotationPlugin)


export const makeChart = (period, stocksData, chartInstance, chartRef, isGreen) => {

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

    // Find the maximum length of the data arrays
    const maxLength = Math.max(...Object.keys(stocksData).map(stockKey => stocksData[stockKey][period].length))
    let annotationValue = 0
    const datasets = Object.keys(stocksData).map((stockKey, index) => {
        const stock = stocksData[stockKey]
        const chartColor = index === 0 ? (isGreen ? themeGreen : themeRed) : colors[index - 1]
        // update annotationValue
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
        // Normalize the length of the data arrays and fill missing values with the last known value
        const normalizedData = [...stock[period]]
        while (normalizedData.length < maxLength) {
            normalizedData.push(normalizedData[normalizedData.length - 1])
        }
        return {
            label: stockKey,
            data: normalizedData,
            borderColor: chartColor,
            fill: false,
            borderWidth: 3,
        }
    })

    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(maxLength).fill(''),
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
                legend: { display: Object.keys(stocksData).length == 1 ? false : true },
                tooltip: { enabled: Object.keys(stocksData).length == 1 ? false : true },
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
                                position: 'end',
                            },
                        },
                    },
                },
            },
        },
    })
}

export const makeChartPercentage = (period, stocksData, chartInstance, chartRef, isGreen) => {
    if (chartInstance.current && typeof chartInstance.current.destroy === 'function') {
        chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    const themeRed = getComputedStyle(document.documentElement).getPropertyValue('--theme-red').trim()
    const chartOrange = getComputedStyle(document.documentElement).getPropertyValue('--chart-orange').trim()
    const chartBlue = getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim()
    const chartPink = getComputedStyle(document.documentElement).getPropertyValue('--chart-pink').trim()
    const chartYellow = getComputedStyle(document.documentElement).getPropertyValue('--chart-yellow').trim()
    const chartCyan = getComputedStyle(document.documentElement).getPropertyValue('--chart-cyan').trim()
    const colors = [chartOrange, chartBlue, chartPink, chartCyan, chartYellow]

    const datasets = Object.keys(stocksData).map((stockKey, index) => {
        const stock = stocksData[stockKey]
        const chartColor = index === 0 ? (isGreen ? themeGreen : themeRed) : colors[index - 1]
        // Add currentPrice to the end of the stock[period] array
        if (stock[period] && stock.currentPrice !== undefined) {
            stock[period].push(stock.currentPrice)
        }
        // Calculate the growth percentage
        const initialPrice = stock[period][0]
        const growthData = stock[period].map(price => ((price - initialPrice) / initialPrice) * 100)

        return {
            label: stockKey,
            data: growthData,
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
                legend: { display: Object.keys(stocksData).length == 1 ? false : true },
                tooltip: { enabled: Object.keys(stocksData).length == 1 ? false : true },
            },
        },
    })
}


export const makeChartSmall = (stock, chartInstance, chartRef, isGreen) => {
    const period = 'historical_data_1d'
    if (chartInstance && chartInstance.current) {
        chartInstance.current.destroy()
    }
    if (!stock) return
    // Set the canvas size to 50% of its original size
    chartRef.width = chartRef.width / 2
    chartRef.height = chartRef.height / 2

    const ctx = chartRef.getContext('2d')
    const themeGreen = getComputedStyle(document.documentElement).getPropertyValue('--theme-green').trim()
    const themeRed = getComputedStyle(document.documentElement).getPropertyValue('--theme-red').trim()
    const lightGrey = getComputedStyle(document.documentElement).getPropertyValue('--text-field-grey').trim()
    const chartColor = isGreen ? themeGreen : themeRed
    let annotationValue

    annotationValue = stock?.info?.previousClose || 0
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

