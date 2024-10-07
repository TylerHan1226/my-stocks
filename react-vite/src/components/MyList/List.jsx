import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, getAllStocksInListThunk } from "../../redux/list"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import StockOptionModal from "./StockOptionModal";
import Loading from "../Loading/Loading";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { useModal } from "../../context/Modal";
import ScreenerPeriodModal from "./ScreenerPeriodModal";
import ScreenerHistDivModal from "./ScreenerHistDivModal";

export default function List() {
    const dispatch = useDispatch();
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const list = useParams()
    const lists = useSelector(state => state.lists?.My_Lists)
    const selectedLists = lists?.filter(ele => ele.list_name == list?.listName)
    const listStockData = useSelector(state => state.lists?.stocks_data)
    const stockSymbols = lists?.filter(ele => ele.list_name == list?.listName).map(ele => ele.stock_symbol)
    const [isLoading, setIsLoading] = useState(true)
    const [isScreenerOn, setIsScreenerOn] = useState(false)
    const {setModalContent} = useModal()

    const getStockData = (symbol) => {
        const stock = listStockData[symbol]
        const stockCurrentPrice = stock?.currentPrice?.toFixed(2)
        const stockPreviousClosing = stock?.info?.previousClose
        const stockTrPE = stock?.info?.trailingPE?.toFixed(2)
        const stockFwPE = stock?.info?.forwardPE?.toFixed(2)
        const isStockGreen = stockCurrentPrice > stockPreviousClosing
        const quoteType = stock?.info?.sector || stock?.info?.quoteType
        const stockDividendYield = (stock?.info?.dividendYield * 100)?.toFixed(2)
        const stockYield = (stock?.info?.yield * 100)?.toFixed(2)
        const stockDividendRate = parseFloat(stock?.info?.dividendRate?.toFixed(2))
        const stockHistoricalDividendRate = selectedLists?.filter(ele => ele.stock_symbol == symbol)[0]?.historical_dividend
        const stockDividendGrowth = stockHistoricalDividendRate ? stockDividendRate - stockHistoricalDividendRate : null
        const stockEps = stock?.info?.trailingEps?.toFixed(2)
        const listId = lists?.filter(ele => ele.stock_symbol == symbol && ele.list_name == list?.listName)[0].id
        const stockScreenerPeriod = lists?.filter(ele => ele.id == listId)[0]?.screener_period
        const stockPeriod = stockScreenerPeriod ? stockScreenerPeriod : stock?.historical_data_10yr?.length > 0 ? 'historical_data_10yr' : stock?.historical_data_5yr?.length > 0 ? 'historical_data_5yr' : stock?.historical_data_1yr?.length ? 'historical_data_1yr' : stock?.historical_data_6mo?.length ? 'historical_data_6mo' : ''
        const stockPeriodText = stockPeriod?.split('_')[2]
        const stockHistoricalPrice = stock[stockPeriod][0]?.toFixed(2)
        const yearlyPriceChange = (stockCurrentPrice / stockHistoricalPrice).toFixed(2)
        const stockPayoutRatio = (stock?.info?.payoutRatio * 100)?.toFixed(2)
        const inputPeriod = stockPeriodText == '10yr' ? 10 : stockPeriodText == '5yr' ? 5 : stockPeriodText == '1yr' ? 1 : stockPeriodText == '6mo' ? 0.5 : null
        function getYearlyDividendGrowth(startDividend, endDividend, periods) {
            if (startDividend) return (Math.pow((endDividend / startDividend), 1 / periods) - 1)?.toFixed(2)
        }
        const stockYearlyDividendGrowth = !isNaN(stockDividendRate) ? getYearlyDividendGrowth(stockHistoricalDividendRate, stockDividendRate, inputPeriod) : !isNaN(stockYield) ? getYearlyDividendGrowth(stockHistoricalDividendRate, stockYield, inputPeriod) : null

        return { stock, stockCurrentPrice, stockPreviousClosing, stockTrPE, stockFwPE, isStockGreen, quoteType, stockDividendYield, stockYield, stockDividendRate, stockHistoricalDividendRate, stockDividendGrowth, stockEps, listId, stockScreenerPeriod, stockPeriod, stockPeriodText, stockHistoricalPrice, yearlyPriceChange, stockPayoutRatio, inputPeriod, stockYearlyDividendGrowth }

    }

    const handleShowScreener = () => {
        setIsScreenerOn(prev => !prev)
    }
    const handleScreenerSettings = () => {
        console.log('handleScreenerSettings clicked !!')
    }
    const handleScreenerPeriod = (symbol, currentPeriod, listId, stock) => {
        setModalContent(<ScreenerPeriodModal symbol={symbol} currentPeriod={currentPeriod} listId={listId} stock={stock}/>)
    }
    const handleHistoricalDividend = (symbol, listId) => {
        console.log('handleHistoricalDividend clicked !!')
        setModalContent(<ScreenerHistDivModal symbol={symbol} listId={listId}/>)
    }


    useEffect(() => {
        dispatch(getAllMyListsThunk())
        dispatch(getAllStocksInListThunk(list?.listName))
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [dispatch])

    if (!user) {
        return nav('/')
    }
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
            <section className="page-content-container">
                <h1 className="page-title">{list.listName}</h1>
                <div className="list-screener-btn-container">
                    <button className={`list-screener-btn ${isScreenerOn ? 'md-btn' : 'wide-btn'}`}
                        onClick={handleShowScreener}>
                        {isScreenerOn ? 'Hide Screeners' : 'Show Screeners'}
                    </button>
                    {isScreenerOn &&
                        <button className="list-screener-btn narrow-btn"
                            onClick={handleScreenerSettings}>
                            + / -
                        </button>}
                </div>

                <section className="list-content-container">
                    {isScreenerOn &&
                        <section className="screener-action-container">
                            {stockSymbols?.map((eachSymbol, index) => {
                                const stock = listStockData[eachSymbol]
                                const listId = lists?.filter(ele => ele.stock_symbol == eachSymbol && ele.list_name == list?.listName)[0].id
                                const stockScreenerPeriod = lists?.filter(ele => ele.id == listId)[0]?.screener_period
                                let stockPeriod = stockScreenerPeriod ? stockScreenerPeriod : stock?.historical_data_10yr?.length > 0 ? 'historical_data_10yr' : stock?.historical_data_5yr?.length > 0 ? 'historical_data_5yr' : stock?.historical_data_1yr?.length ? 'historical_data_1yr' : stock?.historical_data_6mo?.length ? 'historical_data_6mo' : ''
                                const stockPeriodText = stockPeriod?.split('_')[2]

                                return (
                                    <div className="screener-action-tabs" key={index}>
                                        <p className="screener-texts-symbol">{eachSymbol}</p>
                                        <button className="screener-period-btn"
                                            onClick={() => handleScreenerPeriod(eachSymbol, stockPeriod, listId, stock)}>
                                            {stockPeriodText}
                                        </button>
                                    </div>

                                )
                            })}
                        </section>}

                    <section className={`${isScreenerOn ? 'list-tabs-container-w-screener' : 'list-tabs-container'}`}>

                        {stockSymbols?.map((eachSymbol, index) => {

                            const stockData = getStockData(eachSymbol)

                            return (
                                <section key={index}>
                                    {isScreenerOn && index == 0 &&
                                        <section className="screener-header-container">
                                            <p className="screener-header-texts-type">Type</p>
                                            <p className="screener-header-texts">Trailing P/E</p>
                                            <p className="screener-header-texts">Forward P/E</p>
                                            <p className="screener-header-texts">Current Price</p>
                                            <p className="screener-header-texts">Historical Price</p>
                                            <p className="screener-header-texts">Yearly Price Change</p>
                                            <p className="screener-header-texts">Dividend Yield</p>
                                            <p className="screener-header-texts">Current Dividend</p>
                                            <p className="screener-header-texts-historical-dividend">Historical Dividend</p>
                                            <p className="screener-header-texts">Total Dividend Growth</p>
                                            <p className="screener-header-texts">Yearly Dividend Growth</p>
                                            <p className="screener-header-texts">Earning Per Share</p>
                                            <p className="screener-header-texts">Payout Ratio</p>
                                        </section>}
                                    {isScreenerOn ?
                                        <section className="screener-container">

                                            <div className="screener-stock-tabs">
                                                <p className={`screener-texts-type`}>
                                                    {stockData?.quoteType}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockTrPE ? stockData?.stockTrPE : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockFwPE ? stockData?.stockFwPE : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {`$${stockData?.stockCurrentPrice}`}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {`$${stockData?.stockHistoricalPrice}`}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.yearlyPriceChange}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {!isNaN(stockData?.stockDividendYield) ? `${stockData?.stockDividendYield}%` : stockData?.stockYield != 'NaN' ? `${stockData?.stockYield} %` : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockDividendRate > 0 ? `$${stockData?.stockDividendRate}` : '-'}
                                                </p>
                                                <div className="screener-label-historical-dividend">
                                                    <p className={`screener-texts-historical-dividend`}>
                                                        {stockData?.stockHistoricalDividendRate > 0 ? `$${stockData?.stockHistoricalDividendRate}` : '-'}
                                                    </p>
                                                    <button className="screener-plus-btn"
                                                        onClick={() => handleHistoricalDividend(eachSymbol, stockData?.listId)}>
                                                        +
                                                    </button>
                                                </div>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockDividendGrowth ? `$${stockData?.stockDividendGrowth.toFixed(2)}` : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockYearlyDividendGrowth && stockData?.stockYearlyDividendGrowth != 0 ? `$${stockData?.stockYearlyDividendGrowth}` : stockData?.stockYearlyDividendGrowth == 0 ? 0 : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockEps > 0 ? `$${stockData?.stockEps}` : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockData?.stockPayoutRatio > 0 ? `${stockData?.stockPayoutRatio}%` : '-'}
                                                </p>
                                            </div>
                                        </section> :

                                        <section className="list-three-dots-container">
                                            <NavLink className={`stock-tab ${stockData?.isStockGreen ? 'green-border' : 'red-border'}`} to={`/search/${eachSymbol}`}>
                                                <h2 className={`stock-tab-title ${stockData?.isStockGreen ? 'is-green' : 'is-red'}`}>
                                                    {eachSymbol}
                                                </h2>
                                                <div className="stock-tab-title">
                                                    <h2 className={`${isScreenerOn ? 'text-w-screener' : 'stock-tab-price'} ${stockData?.isStockGreen ? 'is-green' : 'is-red'}`}>
                                                        {stockData?.stockCurrentPrice}
                                                    </h2>
                                                    {stockData?.stockCurrentPrice && stockData?.stockPreviousClosing ?
                                                        (stockData?.isStockGreen ?
                                                            (<div className="stock-tab-title stock-tab-up-arrow">
                                                                <GoTriangleUp />
                                                            </div>) :
                                                            (<div className="stock-tab-title stock-tab-down-arrow">
                                                                <GoTriangleDown />
                                                            </div>)
                                                        ) : null
                                                    }
                                                    <p className={`stock-tab-percentage ${stockData?.isStockGreen ? 'is-green' : 'is-red'}`}>
                                                        {stockData?.stockCurrentPrice && stockData?.stockPreviousClosing ?
                                                            `${(((stockData?.stockCurrentPrice - stockData?.stockPreviousClosing) / stockData?.stockPreviousClosing) * 100).toFixed(2)}%`
                                                            : null
                                                        }
                                                    </p>
                                                </div>
                                            </NavLink>
                                            <div className="three-dot-btn">
                                                <OpenModalMenuItem
                                                    itemText={<BsThreeDotsVertical />}
                                                    className="three-dots"
                                                    modalComponent={<StockOptionModal stockSymbol={eachSymbol} />}
                                                />
                                            </div>
                                        </section>}
                                </section>)
                        })}
                    </section>
                    {isScreenerOn &&
                        <section className="screener-total-container">
                            <div className="screener-header-total-container">
                                <p className="screener-header-texts-total">{`Yearly Total Growth (%)`}</p>
                                <div className="screener-header-total-item-container">
                                    <p className="screener-header-texts-total-item">Current Dividend</p>
                                    <p className="screener-header-texts-total-item">Dividend Growth</p>
                                    <p className="screener-header-texts-total-item">Price</p>
                                    <p className="screener-header-texts-total-item-sum">Sum</p>
                                </div>
                                <section className="screener-total-tab-container">
                                    {stockSymbols?.map((eachSymbol, index) => {

                                        const stockData = getStockData(eachSymbol)
                                        const stockDividendRate = stockData?.stockDividendRate
                                        const stockDividendYield = stockData?.stockDividendYield
                                        const stockHistoricalDividendRate = stockData?.stockHistoricalDividendRate
                                        const stockHistoricalPrice = stockData?.stockHistoricalPrice
                                        const stockCurrentPrice = stockData?.stockCurrentPrice
                                        const inputPeriod = stockData?.inputPeriod
                                        const stockYield = stockData?.stockYield
                                        function getYearlyGrowth(historicalData, currentData, periods) {
                                            if (historicalData) return (Math.pow((currentData / historicalData), 1 / periods) - 1)
                                        }
                                        const stockYearlyDividendGrowth = !isNaN(stockDividendRate) ? getYearlyGrowth(stockHistoricalDividendRate, stockDividendRate, inputPeriod) : !isNaN(stockYield) ? getYearlyGrowth(stockHistoricalDividendRate, stockYield, inputPeriod) : null
                                        const yearlyPriceGrowth = getYearlyGrowth(stockHistoricalPrice, stockCurrentPrice, inputPeriod)
                                        const stockYearlyDividendGrowthRate = stockDividendYield != 'NaN' ? stockDividendYield * stockYearlyDividendGrowth : stockYield != 'NaN' ? stockYield * stockYearlyDividendGrowth : '-'
                                        let sum = '-'
                                        if (!isNaN(stockDividendYield) && !isNaN(stockYearlyDividendGrowthRate) && !isNaN(yearlyPriceGrowth)) {
                                            sum = (parseFloat(stockDividendYield) + parseFloat(stockYearlyDividendGrowthRate) + yearlyPriceGrowth* 100).toFixed(2)
                                        } else if (!isNaN(stockYield) && !isNaN(stockYearlyDividendGrowthRate) && !isNaN(yearlyPriceGrowth)) {
                                            sum = (parseFloat(stockYield) + parseFloat(stockYearlyDividendGrowthRate) + yearlyPriceGrowth * 100).toFixed(2)
                                        }

                                        return (
                                            <div className="screener-total-tabs" key={index}>
                                                <p className="screener-texts">
                                                    {stockDividendYield != 'NaN' ? stockDividendYield : stockYield != 'NaN' ? stockYield : '-'}
                                                </p>
                                                <p className="screener-texts">
                                                    {isNaN(stockYearlyDividendGrowthRate) ? '-' : stockYearlyDividendGrowthRate < 0.02 ? 0 : stockYearlyDividendGrowthRate.toFixed(2)}
                                                </p>
                                                <p className="screener-texts">
                                                    {!isNaN(yearlyPriceGrowth) ? `${(yearlyPriceGrowth * 100).toFixed(2)}` : '-'}
                                                </p>
                                                <p className="screener-texts-sum">
                                                    {!isNaN(sum) ? sum : '-'}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </section>
                            </div></section>

                    }
                </section>

            </section>
        </section>
    )
}