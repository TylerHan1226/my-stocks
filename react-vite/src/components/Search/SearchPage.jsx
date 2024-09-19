import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useModal } from "../../context/Modal";
import Loading from "../Loading/Loading";
import { getOneStockThunk } from "../../redux/stock";
import AddListModal from "../MyList/AddListModal";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

Chart.register(annotationPlugin);
import { makeChart } from "../Helper/Helper";

export default function SearchPage() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { searchInput } = useParams()
    const user = useSelector(state => state.session.user)
    const stock = useSelector(state => state.stocks)
    const [isLoading, setIsLoading] = useState(true)
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    const stockName = stock?.name
    const stockSymbol = stock?.ticker
    const stockBusSum = stock?.info?.longBusinessSummary
    const stockComOfficers = stock?.info?.companyOfficers
    const stockEmployeeNum = stock?.info?.fullTimeEmployees
    const stockHeadquarter = `${stock?.info?.city}, ${stock?.info?.state}`
    const stockCurrentPrice = stock?.currentPrice?.toFixed(2)
    const stockOpenPrice = stock?.info?.previousClose?.toFixed(2)
    const stockAsk = stock?.info?.ask
    const stockAskSize = stock?.info?.askSize
    const stockBidSize = stock?.info?.bidSize
    const stockBid = stock?.info?.bid
    const stockPreviousClosePrice = stock?.info?.open?.toFixed(2)
    const stockMarketCap = stock?.info?.marketCap
    const stockPERatio = stock?.info?.trailingPE?.toFixed(2)
    const stockFwPERatio = stock?.info?.forwardPE?.toFixed(2)
    const stockVolume = stock?.info?.volume
    const stockDividendYield = (stock?.info?.dividendYield * 100)?.toFixed(2)
    const stockYield = (stock?.info?.yield * 100)?.toFixed(2)
    const stockYieldDailyReturn = (stock?.info?.ytdReturn * 100)?.toFixed(2)
    const stockNetAssets = stock?.info?.totalAssets
    const stock50DAvg = stock?.info?.fiftyDayAverage?.toFixed(2)
    const stockDayHigh = stock?.info?.dayHigh?.toFixed(2)
    const stockDayLow = stock?.info?.dayLow?.toFixed(2)
    const stock52WkLow = stock?.info?.fiftyTwoWeekLow?.toFixed(2)
    const stock52WkHigh = stock?.info?.fiftyTwoWeekHigh?.toFixed(2)
    const stockPriceChange = stock?.currentPrice - stock?.info?.previousClose
    const stockPercentage = ((stockPriceChange / stock?.info?.previousClose) * 100).toFixed(2)


    const [chartPeriod, setChartPeriod] = useState('historical_data_1d')
    const isGreen = stockCurrentPrice > stockOpenPrice ? true : false
    const isNoPeriod = !(Object.keys(stock).length && stock[chartPeriod])

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(<AddListModal stockSymbol={stockSymbol} />)
    }

    const handleChartPeriod = (period) => {
        setChartPeriod(period)
    }
    const getButtonClass = (period) => {
        const isSelected = chartPeriod === period
        const periodIsGreen = !isNoPeriod ? stock[chartPeriod][0] < stock[chartPeriod][stock[chartPeriod].length - 1] : true
        const colorClass = periodIsGreen ? 'green' : 'red'
        return `stock-chart-btns ${isSelected ? `chart-btns-selected-${colorClass}` : `is-${colorClass}`}`
    }
    // Get period history based on trading days
    const stockHistory = stock?.history
    const periodTDMapping = {
        'historical_data_1wk': -5,
        'historical_data_1mo': -21,
        'historical_data_3mo': -63,
        'historical_data_1yr': -252,
        'historical_data_5yr': -1260,
        'historical_data_10yr': -2520
    }
    const stockPeriodHistory = stockHistory?.slice(periodTDMapping[chartPeriod] || 0)
    const hasHistory = stockPeriodHistory?.length > 0
    const stockPeriodPriceChange = hasHistory ? stockCurrentPrice - stockPeriodHistory[0]?.Close : null
    const stockPeriodPricePercentage = hasHistory ? (stockPeriodPriceChange / stockPeriodHistory[0]?.Close) * 100 : null
    
    // const currentDate = new Date().toISOString().split('T')[0]
    // const currentYear = currentDate?.split('-')[0]
    // const firstTDData = stockHistory?.filter(ele => ele?.Date.includes(currentYear))[0]
    // const stockYTDPriceChange = stockCurrentPrice - firstTDData?.Close
    // const stockYTDPricePercentage = (stockYTDPriceChange / firstTDData?.Close) * 100
    // console.log('firstTDData ==>', firstTDData)
    // console.log('stockYTDPricePercentage ==>', stockYTDPricePercentage)

    useEffect(() => {
        if (!user) {
            return nav('/')
        }
        setIsLoading(true)
        dispatch(getOneStockThunk(searchInput))
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [nav, dispatch, searchInput, user])

    useEffect(() => {
        if (Object.keys(stock).length > 0 && chartRef.current) {
            const periodIsGreen = !isNoPeriod ? stock[chartPeriod][0] < stock[chartPeriod][stock[chartPeriod].length - 1] : true
            makeChart(chartPeriod, stock, chartInstance, chartRef, periodIsGreen)
        }
    }, [chartPeriod, stock, chartInstance, chartRef, isLoading])

    if (isLoading) {
        return (
            <section className="page-container">
                <section className="page-content-container">
                    <Loading />
                </section>
            </section>
        )
    }

    return (
        <section className="page-container">
            {Object.keys(stock).length > 0 ? (
                <section className="page-content-container">
                    <div className="stock-header-container">
                        <h1 className="page-title">{`${stockName} (${stockSymbol})`}</h1>
                        <h1 className="page-title stock-page-title-price">${stockCurrentPrice}</h1>
                        <button
                            className="stock-page-action-btn"
                            onClick={handleOpenModal}>
                            ADD TO LIST
                        </button>
                    </div>
                    <section className="search-info-container">

                        <div className="stock-chart-price-container">
                            <div className="stock-chart-price">
                                {stockPercentage > 0 ?
                                    <p className="is-green">
                                        <GoTriangleUp className="stock-chart-arrow" />
                                    </p> : <p className="is-red">
                                        <GoTriangleDown className="stock-chart-arrow" />
                                    </p>}
                                <p className={`stock-chart-price-text ${isGreen ? 'is-green' : 'is-red'}`}>
                                    {stockPriceChange > 0 ? `+${stockPriceChange.toFixed(2)}` : `${stockPriceChange.toFixed(2)}`}
                                </p>
                                <p className={`stock-chart-price-text ${isGreen ? 'is-green' : 'is-red'}`}>
                                    {`(${stockPercentage}%)`}
                                </p>
                            </div>
                            {chartPeriod !== 'historical_data_1d' && chartPeriod !== 'historical_data_ytd' &&
                                <div className="stock-chart-period-price">
                                    {stockPeriodPriceChange > 0 ?
                                        <p className="is-green">
                                            <GoTriangleUp className="stock-chart-arrow" />
                                        </p> : <p className="is-red">
                                            <GoTriangleDown className="stock-chart-arrow" />
                                        </p>}
                                    <p className={`stock-chart-price-text ${stockPeriodPriceChange > 0 ? 'is-green' : 'is-red'}`}>
                                        {stockPeriodPriceChange > 0 ? `+${stockPeriodPriceChange.toFixed(2)}` : `${stockPeriodPriceChange.toFixed(2)}`}
                                    </p>
                                    <p className={`stock-chart-price-text ${stockPeriodPriceChange > 0 ? 'is-green' : 'is-red'}`}>
                                        {stockPeriodPricePercentage > 0 ? `(+${stockPeriodPricePercentage.toFixed(2)}%)` : `(${stockPeriodPricePercentage.toFixed(2)}%)`} in the past {-periodTDMapping[chartPeriod]} trading days
                                    </p>
                                </div>}
                        </div>

                        <div className="stock-chart-container">
                            <canvas className="stock-sparkline-chart" ref={chartRef}></canvas>
                            <div className="stock-chart-btn-container">
                                {['historical_data_1d', 'historical_data_1wk', 'historical_data_1mo', 'historical_data_3mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr', 'historical_data_ytd'].map(period => (
                                    stock[period].length > 0 && (
                                        <button
                                            key={period}
                                            className={getButtonClass(period)}
                                            onClick={() => handleChartPeriod(period)}>
                                            {period.replace('historical_data_', '').toUpperCase()}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>

                        <h2>About</h2>
                        <div className="search-info-boxes">
                            <p>{stockBusSum}</p>
                            <div className="search-info-about-container">
                                {stockComOfficers?.length > 0 &&
                                    <p className="search-info-text">
                                        CEO: {stockComOfficers?.filter(ele => ele.title.includes("CEO"))[0]?.name}
                                    </p>
                                }
                                {stockEmployeeNum?.length > 0 &&
                                    <p className="search-info-text">
                                        Full-time Employees: {stockEmployeeNum}
                                    </p>
                                }
                                {stockHeadquarter?.length > 0 &&
                                    <p className="search-info-text">
                                        Headquarters: {stockHeadquarter}
                                    </p>
                                }
                            </div>
                        </div>
                        <h2>Key Statistics</h2>
                        <div className="search-info-boxes">
                            <div className="search-info-texts-container">

                                <div className="stock-info-column">
                                    <p className="search-info-text">
                                        Current Price: {!isNaN(stockCurrentPrice) ? `${stockCurrentPrice}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Previous close price: {!isNaN(stockPreviousClosePrice) ? `${stockPreviousClosePrice}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Open price: {!isNaN(stockOpenPrice) ? `${stockOpenPrice}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Bid: {!isNaN(stockBid)
                                            ? (!isNaN(stockBidSize)
                                                ? `${stockBid} x ${stockBidSize}`
                                                : `${stockBid}`)
                                            : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Ask: {!isNaN(stockAsk)
                                            ? (!isNaN(stockAskSize)
                                                ? `${stockAsk} x ${stockAskSize}`
                                                : `${stockAsk}`)
                                            : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        50-day average: {!isNaN(stock50DAvg) ? `${stock50DAvg}` : 'N/A'}
                                    </p>

                                </div>

                                <div className="stock-info-column">

                                    <p className="search-info-text">
                                        Volume: {!isNaN(stockVolume)
                                            ? (stockVolume > 1000000000000
                                                ? `${(stockVolume / 1000000000000).toFixed(2)}T`
                                                : stockVolume > 1000000000
                                                    ? `${(stockVolume / 1000000000).toFixed(2)}B`
                                                    : `${(stockVolume / 1000000).toFixed(2)}M`)
                                            : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        High today: {!isNaN(stockDayHigh) ? `${stockDayHigh}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Low today: {!isNaN(stockDayLow) ? `${stockDayLow}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        52 Week high: {!isNaN(stock52WkHigh) ? `${stock52WkHigh}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        52 Week low: {!isNaN(stock52WkLow) ? `${stock52WkLow}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Market cap: {!isNaN(stockMarketCap) ? (stockMarketCap > 1000000000000
                                            ? (stockMarketCap / 1000000000000)?.toFixed(2) + 'T'
                                            : stockMarketCap > 1000000000
                                                ? (stockMarketCap / 1000000000)?.toFixed(2) + 'B'
                                                : (stockMarketCap / 1000000)?.toFixed(2) + 'M') : 'N/A'}
                                    </p>

                                </div>

                                <div className="stock-info-column">

                                    <p className="search-info-text">
                                        Net Assets: {!isNaN(stockNetAssets) ? (stockNetAssets > 1000000000000
                                            ? (stockNetAssets / 1000000000000)?.toFixed(2) + 'T'
                                            : stockNetAssets > 1000000000
                                                ? (stockNetAssets / 1000000000)?.toFixed(2) + 'B'
                                                : (stockNetAssets / 1000000)?.toFixed(2) + 'M') : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Price-Earning ratio: {!isNaN(stockPERatio) ? `${stockPERatio}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Forward Price-Earning ratio: {!isNaN(stockFwPERatio) ? `${stockFwPERatio}` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Dividend Yield: {!isNaN(stockDividendYield) ? `${stockDividendYield}%` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Yield: {!isNaN(stockYield) ? `${stockYield}%` : 'N/A'}
                                    </p>
                                    <p className="search-info-text">
                                        Yield Daily Total Return: {!isNaN(stockYieldDailyReturn) ? `${stockYieldDailyReturn}%` : 'N/A'}
                                    </p>

                                </div>

                            </div>
                        </div>
                    </section>
                </section>) : (
                <section className="page-content-container">
                    <h1 className="page-title">Stock Not Found</h1>
                </section>
            )}
        </section>
    )
}
