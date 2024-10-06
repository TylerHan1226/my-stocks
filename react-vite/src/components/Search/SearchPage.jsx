import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useModal } from "../../context/Modal";
import Loading from "../Loading/Loading";
import { getOneStockThunk, getStocksToCompareThunk } from "../../redux/stock";
import AddListModal from "../MyList/AddListModal";
import Chart from 'chart.js/auto';
import News from "../News/News";
import annotationPlugin from 'chartjs-plugin-annotation';
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { IoMdRefresh } from "react-icons/io";
Chart.register(annotationPlugin);
import { makeChart, makeChartPercentage } from "../Helper/Helper";
import CompareStocks from "./CompareStocks";

export default function SearchPage() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { searchInput } = useParams()
    const user = useSelector(state => state.session.user)
    const stock = useSelector(state => state.stocks)
    const [isLoading, setIsLoading] = useState(true)
    const chartRef = useRef(null)
    const chartInstance = useRef(null)
    const stocksToCompareData = useSelector(state => state.stocks?.stocks_to_compare)

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
    const isGreen = stockPriceChange > 0 ? true : false
    const isNoPeriod = !(Object.keys(stock).length && stock[chartPeriod])

    const [stockToCompare, setStockToCompare] = useState('')
    const [stocksToCompareArr, setStocksToCompareArr] = useState([])
    const [isChartPercentage, setIsChartPercentage] = useState(false)

    // Get period history based on trading days
    const stockHistory = stock?.history
    const periodTDMapping = {
        'historical_data_1wk': -5,
        'historical_data_1mo': -21,
        'historical_data_3mo': -63,
        'historical_data_6mo': -126,
        'historical_data_1yr': -252,
        'historical_data_5yr': -1260,
        'historical_data_10yr': -2520
    }
    const stockPeriodHistory = stockHistory?.slice(periodTDMapping[chartPeriod] || 0)
    const hasHistory = stockPeriodHistory?.length > 0
    const stockPeriodPriceChange = hasHistory ? stockCurrentPrice - stockPeriodHistory[0]?.Open : null
    const stockPeriodPricePercentage = hasHistory ? (stockPeriodPriceChange / stockPeriodHistory[0]?.Open) * 100 : null
    const periodIsGreen = !isNoPeriod ? stockPeriodPriceChange > 0 : false

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(<AddListModal stockSymbol={stockSymbol} />)
    }
    // chart
    const handleChartPeriod = (period) => {
        setChartPeriod(period)
    }
    const getButtonClass = (period) => {
        const isSelected = chartPeriod === period
        const colorClass = chartPeriod == 'historical_data_1d' ? isGreen ? 'green' : 'red' : periodIsGreen ? 'green' : 'red'
        return `stock-chart-btns ${isSelected ? `chart-btns-selected-${colorClass}` : `is-${colorClass}`}`
    }
    // compare chart
    const handleCompareChartBtn = () => {
        setModalContent(<CompareStocks stockToCompare={stockToCompare} setStockToCompare={setStockToCompare} />)
        if (stocksToCompareArr.length > 5) alert('Can only compare with 5 stocks')
    }
    if (stockToCompare && !stocksToCompareArr.includes(stockToCompare)) {
        setStocksToCompareArr([...stocksToCompareArr, stockToCompare])
    }
    const handleShowPercentage = () => {
        setIsChartPercentage(prev => !prev)
    }
    const handleResetPage = () => {
        window.location.reload()
    }

    useEffect(() => {
        if (stocksToCompareArr.length > 0) {
            setIsLoading(true)
            dispatch(getStocksToCompareThunk(stocksToCompareArr)).then(() => setIsLoading(false))
        }
    }, [dispatch, stocksToCompareArr, stockToCompare])

    useEffect(() => {
        if (!user) {
            return nav('/')
        }
        setIsLoading(true)
        dispatch(getOneStockThunk(searchInput)).then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [nav, dispatch, searchInput, user])

    useEffect(() => {
        if (Object.keys(stock).length > 0 && chartRef.current) {
            const stocksData = { [stockSymbol]: stock, ...stocksToCompareData }
            const makeChartFunction = isChartPercentage ? makeChartPercentage : makeChart
            const isGreenValue = chartPeriod == 'historical_data_1d' ? isGreen : periodIsGreen
            makeChartFunction(chartPeriod, stocksData, chartInstance, chartRef, isGreenValue)
        }
    }, [chartPeriod, stock, stocksToCompareData, chartInstance, chartRef, isLoading, isChartPercentage])

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

                    <section className="stock-header-container">
                        <h1 className="page-title">{`${stockName} (${stockSymbol})`}</h1>
                        <h1 className="page-title stock-page-title-price">${stockCurrentPrice}</h1>
                        <div className="stock-page-action-btn-container">
                        <NavLink className="stock-page-refresh-btn" onClick={handleResetPage}>
                                <IoMdRefresh className="stock-page-refresh-logo" />
                            </NavLink>
                            <button
                                className="stock-page-action-btn"
                                onClick={handleOpenModal}>
                                ADD TO LIST
                            </button>
                            <button
                                className="stock-page-action-btn"
                                onClick={handleCompareChartBtn}>
                                COMPARE CHART
                            </button>
                            <button
                                className={`stock-page-action-btn ${isChartPercentage ? 'is-background-green' : ''}`}
                                onClick={handleShowPercentage}>
                                GROWTH %
                            </button>

                        </div>
                    </section>

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
                            {chartPeriod !== 'historical_data_1d' &&
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
                                {['historical_data_1d', 'historical_data_1wk', 'historical_data_1mo', 'historical_data_3mo', 'historical_data_6mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr'].map(period => (
                                    stock[period]?.length > 0 && (
                                        <button
                                            key={period}
                                            className={getButtonClass(period)}
                                            onClick={() => handleChartPeriod(period)}>
                                            {period.replace('historical_data_', '').toUpperCase() == '10YR' ?
                                                period.replace('historical_data_', '').toUpperCase().slice(0, 3) :
                                                period.replace('historical_data_', '').toUpperCase().slice(0, 2)
                                            }
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                        {stockBusSum && (
                            <>
                                <h2 className="search-info-title">About</h2>
                                <div className="search-info-boxes">
                                    <p>{stockBusSum}</p>
                                    <div className="search-info-about-container">
                                        {stockComOfficers?.some(ele => ele.title.includes("CEO")) && (
                                            <p className="search-info-text">
                                                CEO: {stockComOfficers.find(ele => ele.title.includes("CEO"))?.name}
                                            </p>
                                        )}
                                        {stockEmployeeNum && (
                                            <p className="search-info-text">
                                                Full-time Employees: {stockEmployeeNum}
                                            </p>
                                        )}
                                        {stockHeadquarter && !stockHeadquarter.includes('undefined') && (
                                            <p className="search-info-text">
                                                Headquarters: {stockHeadquarter}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <h2 className="search-info-title">Key Statistics</h2>
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
                                        Volume: {!isNaN(stockVolume) || stockVolume < 1
                                            ? (stockVolume > 1000000000000
                                                ? `${(stockVolume / 1000000000000).toFixed(2)}T`
                                                : stockVolume > 1000000000
                                                    ? `${(stockVolume / 1000000000).toFixed(2)}B`
                                                    : stockVolume > 1000000
                                                    ? `${(stockVolume / 1000000000).toFixed(2)}M`
                                                    : `${(stockVolume / 1000).toFixed(2)}K`)
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

                    <News stockSymbol={stockSymbol} />

                </section>
            ) : (
                <section className="page-content-container">
                    <h1 className="page-title">Stock Not Found</h1>
                </section>
            )}
        </section>
    )
}
