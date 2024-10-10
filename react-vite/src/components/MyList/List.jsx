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
import ScreenerSettingsModal from "./ScreenerSettingsModal";

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
    const { setModalContent } = useModal()

    console.log('selectedLists ==>', selectedLists)

    const getStockData = (symbol) => {
        const stock = listStockData[symbol]
        const stockCurrentPrice = stock?.currentPrice?.toFixed(2)
        const stockPreviousClosing = stock?.info?.previousClose
        const stockTrPE = stock?.info?.trailingPE?.toFixed(2)
        const stockFwPE = stock?.info?.forwardPE?.toFixed(2)
        const isStockGreen = stockCurrentPrice > stockPreviousClosing
        const quoteType = stock?.info?.sector || stock?.info?.quoteType
        const stock52wkHigh = stock?.info?.fiftyTwoWeekHigh?.toFixed(2)
        const stock52wkLow = stock?.info?.fiftyTwoWeekLow?.toFixed(2)

        const stock52wkDiff = stock52wkHigh - stock52wkLow
        const low = stock52wkDiff * 0.33
        const mid = stock52wkDiff * 0.66
        const stockPriceRating = parseFloat(stockCurrentPrice) - stock52wkLow < low ? 'Low' : parseFloat(stockCurrentPrice) - stock52wkLow < mid ? 'Mid' : 'High'

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
        
        const stockPerformance = selectedLists?.filter(ele => ele.stock_symbol == symbol)[0]?.performance_change
        console.log('stockPerformance ==>', symbol, stockPerformance)

        return { stock, stockCurrentPrice, stockPreviousClosing, stockTrPE, stockFwPE, isStockGreen, quoteType, stock52wkHigh, stock52wkLow, stockPriceRating, stockDividendYield, stockYield, stockDividendRate, stockHistoricalDividendRate, stockDividendGrowth, stockEps, listId, stockScreenerPeriod, stockPeriod, stockPeriodText, stockHistoricalPrice, yearlyPriceChange, stockPayoutRatio, inputPeriod, stockYearlyDividendGrowth, stockPerformance }
    }

    const handleShowScreener = () => {
        setIsScreenerOn(prev => !prev)
    }

    const [showType, setShowType] = useState(true)
    const [showTrPE, setShowTrPE] = useState(true)
    const [showFwPE, setShowFwPE] = useState(true)
    const [showCurrentPrice, setShowCurrentPrice] = useState(true)
    const [showHistoricalPrice, setShowHistoricalPrice] = useState(true)
    const [showYPC, setShowYPC] = useState(true)
    const [show52wkHigh, setShow52wkHigh] = useState(false)
    const [show52wkLow, setShow52wkLow] = useState(false)
    const [showCurrPr52kwk, setShowCurrPr52kwk] = useState(true)
    const [showDivYield, setShowDivYield] = useState(true)
    const [showCurrDiv, setShowCurrDiv] = useState(true)
    const [showHistDiv, setShowHistDiv] = useState(true)
    const [showTotalDivGrowth, setShowTotalDivGrowth] = useState(true)
    const [showYearlyDivGrowth, setShowYearlyDivGrowth] = useState(true)
    const [showEPS, setShowEPS] = useState(true)
    const [showPR, setShowPR] = useState(true)
    const [showPerformance, setShowPerformance] = useState(true)
    const [showTotal, setShowTotal] = useState(true)

    const handleScreenerSettings = () => {
        setModalContent(<ScreenerSettingsModal
            showType={showType}
            setShowType={setShowType}
            showTrPE={showTrPE}
            setShowTrPE={setShowTrPE}
            showFwPE={showFwPE}
            setShowFwPE={setShowFwPE}
            showCurrentPrice={showCurrentPrice}
            setShowCurrentPrice={setShowCurrentPrice}
            showHistoricalPrice={showHistoricalPrice}
            setShowHistoricalPrice={setShowHistoricalPrice}
            showYPC={showYPC}
            setShowYPC={setShowYPC}
            show52wkHigh={show52wkHigh}
            setShow52wkHigh={setShow52wkHigh}
            show52wkLow={show52wkLow}
            setShow52wkLow={setShow52wkLow}
            showCurrPr52kwk={showCurrPr52kwk}
            setShowCurrPr52kwk={setShowCurrPr52kwk}
            showDivYield={showDivYield}
            setShowDivYield={setShowDivYield}
            showCurrDiv={showCurrDiv}
            setShowCurrDiv={setShowCurrDiv}
            showHistDiv={showHistDiv}
            setShowHistDiv={setShowHistDiv}
            showTotalDivGrowth={showTotalDivGrowth}
            setShowTotalDivGrowth={setShowTotalDivGrowth}
            showYearlyDivGrowth={showYearlyDivGrowth}
            setShowYearlyDivGrowth={setShowYearlyDivGrowth}
            showEPS={showEPS}
            setShowEPS={setShowEPS}
            showPR={showPR}
            setShowPR={setShowPR}
            showPerformance={showPerformance}
            setShowPerformance={setShowPerformance}
        />)
    }
    const handleScreenerPeriod = (symbol, currentPeriod, listId, stock) => {
        setModalContent(<ScreenerPeriodModal symbol={symbol} currentPeriod={currentPeriod} listId={listId} stock={stock} />)
    }
    const handleHistoricalDividend = (symbol, listId, currHistDiv) => {
        setModalContent(<ScreenerHistDivModal symbol={symbol} listId={listId} currHistDiv={currHistDiv} />)
    }
    const handlePerformance = () => {
        console.log('handlePerformance clicked!')
    }
    const handleShowTotalGrowth = () => {
        setShowTotal(prev => !prev)
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
                            onClick={() => handleScreenerSettings()}>
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
                                            {showType && <p className="screener-header-texts-type">Type</p>}
                                            {showTrPE && <p className="screener-header-texts">Trailing P/E</p>}
                                            {showFwPE && <p className="screener-header-texts">Forward P/E</p>}
                                            {showCurrentPrice && <p className="screener-header-texts">Current Price</p>}
                                            {showHistoricalPrice && <p className="screener-header-texts">Historical Price</p>}
                                            {showYPC && <p className="screener-header-texts">Yearly Price Change</p>}
                                            {show52wkHigh && <p className="screener-header-texts">52wk High</p>}
                                            {show52wkLow && <p className="screener-header-texts">52wk Low</p>}
                                            {showCurrPr52kwk && <p className="screener-header-texts">Current Price in 52wk Rating</p>}
                                            {showDivYield && <p className="screener-header-texts">Dividend Yield</p>}
                                            {showCurrDiv && <p className="screener-header-texts">Current Dividend</p>}
                                            {showHistDiv && <p className="screener-header-texts-historical-dividend">Historical Dividend</p>}
                                            {showTotalDivGrowth && <p className="screener-header-texts">Total Dividend Growth</p>}
                                            {showYearlyDivGrowth && <p className="screener-header-texts">Yearly Dividend Growth</p>}
                                            {showEPS && <p className="screener-header-texts">Earning Per Share</p>}
                                            {showPR && <p className="screener-header-texts">Payout Ratio</p>}
                                            {showPerformance && <p className="screener-header-texts">Performance in 5 years</p>}
                                        </section>}
                                    {isScreenerOn ?
                                        <section className="screener-container">
                                            <div className="screener-stock-tabs">

                                                {showType &&
                                                    <p className={`screener-texts-type`}>
                                                        {stockData?.quoteType}
                                                    </p>}
                                                {showTrPE && <p className={`screener-texts`}>
                                                    {stockData?.stockTrPE ? stockData?.stockTrPE : '-'}
                                                </p>}
                                                {showFwPE && <p className={`screener-texts`}>
                                                    {stockData?.stockFwPE ? stockData?.stockFwPE : '-'}
                                                </p>}
                                                {showCurrentPrice && <p className={`screener-texts`}>
                                                    {`$${stockData?.stockCurrentPrice}`}
                                                </p>}
                                                {showHistoricalPrice && <p className={`screener-texts`}>
                                                    {`$${stockData?.stockHistoricalPrice}`}
                                                </p>}
                                                {showYPC && <p className={`screener-texts`}>
                                                    {stockData?.yearlyPriceChange}
                                                </p>}

                                                {show52wkHigh && <p className={`screener-texts`}>
                                                    {`$${stockData?.stock52wkHigh}`}
                                                </p>}
                                                {show52wkLow && <p className={`screener-texts`}>
                                                    {`$${stockData?.stock52wkLow}`}
                                                </p>}
                                                {showCurrPr52kwk && <p className={`screener-texts`}>
                                                    {stockData?.stockPriceRating}
                                                </p>}

                                                {showDivYield && <p className={`screener-texts`}>
                                                    {!isNaN(stockData?.stockDividendYield) ? `${stockData?.stockDividendYield}%` : stockData?.stockYield != 'NaN' ? `${stockData?.stockYield} %` : '-'}
                                                </p>}
                                                {showCurrDiv && <p className={`screener-texts`}>
                                                    {stockData?.stockDividendRate > 0 ? `$${stockData?.stockDividendRate}` : '-'}
                                                </p>}
                                                {showHistDiv &&
                                                    <div className="screener-label-historical-dividend">
                                                        <p className={`screener-texts-historical-dividend`}>
                                                            {stockData?.stockHistoricalDividendRate > 0 ? `$${stockData?.stockHistoricalDividendRate}` : '-'}
                                                        </p>
                                                        <button className="screener-plus-btn"
                                                            onClick={() => handleHistoricalDividend(eachSymbol, stockData?.listId, stockData?.stockHistoricalDividendRate)}>
                                                            +
                                                        </button>
                                                    </div>}
                                                {showTotalDivGrowth && <p className={`screener-texts`}>
                                                    {stockData?.stockDividendGrowth ? `$${stockData?.stockDividendGrowth.toFixed(2)}` : '-'}
                                                </p>}
                                                {showYearlyDivGrowth && <p className={`screener-texts`}>
                                                    {!isNaN(stockData?.stockYearlyDividendGrowth) && stockData?.stockYearlyDividendGrowth != 0 ? `${stockData?.stockYearlyDividendGrowth * 100}%` : stockData?.stockYearlyDividendGrowth == 0 ? 0 : '-'}
                                                </p>}
                                                {showEPS && <p className={`screener-texts`}>
                                                    {stockData?.stockEps > 0 ? `$${stockData?.stockEps}` : '-'}
                                                </p>}
                                                {showPR && <p className={`screener-texts`}>
                                                    {stockData?.stockPayoutRatio > 0 ? `${stockData?.stockPayoutRatio}%` : '-'}
                                                </p>}
                                                {showPerformance &&
                                                    <div className="screener-label-historical-dividend">
                                                        <p className={`screener-texts-historical-dividend`}>
                                                            {stockData?.stockPerformance ? `${stockData?.stockPerformance}` : '-'}
                                                        </p>
                                                        <button className="screener-plus-btn"
                                                            onClick={() => handlePerformance()}>
                                                            +
                                                        </button>
                                                    </div>}
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
                    {isScreenerOn && showTotal ?
                        (<section className="screener-total-container">
                            <div className="screener-header-total-container">
                                <div className="screener-header-total">
                                    <p className="screener-header-texts-total">{`Yearly Total Growth (%)`}</p>
                                    <NavLink className="screener-total-show-btn" onClick={handleShowTotalGrowth}>
                                        Hide
                                    </NavLink>
                                </div>
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
                                            sum = (parseFloat(stockDividendYield) + parseFloat(stockYearlyDividendGrowthRate) + yearlyPriceGrowth * 100).toFixed(2)
                                        } else if (!isNaN(stockYield) && !isNaN(stockYearlyDividendGrowthRate) && !isNaN(yearlyPriceGrowth)) {
                                            sum = (parseFloat(stockYield) + parseFloat(stockYearlyDividendGrowthRate) + yearlyPriceGrowth * 100).toFixed(2)
                                        } else if (isNaN(stockDividendYield) && !isNaN(stockYield) && isNaN(stockYearlyDividendGrowthRate) && !isNaN(yearlyPriceGrowth)) {
                                            sum = (parseFloat(stockYield) + yearlyPriceGrowth * 100).toFixed(2)
                                        }

                                        return (
                                            <div className="screener-total-tabs" key={index}>
                                                <p className="screener-texts-yearly-t-growth">
                                                    {stockDividendYield != 'NaN' ? stockDividendYield : stockYield != 'NaN' ? stockYield : '-'}
                                                </p>
                                                <p className="screener-texts-yearly-t-growth">
                                                    {isNaN(stockYearlyDividendGrowthRate) ? '-' : stockYearlyDividendGrowthRate < 0.02 ? 0 : stockYearlyDividendGrowthRate.toFixed(2)}
                                                </p>
                                                <p className="screener-texts-yearly-t-growth">
                                                    {!isNaN(yearlyPriceGrowth) ? `${(yearlyPriceGrowth * 100).toFixed(2)}` : '-'}
                                                </p>
                                                <p className="screener-texts-sum">
                                                    {!isNaN(sum) ? sum : '-'}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </section>
                            </div>
                        </section>) : isScreenerOn && !showTotal ? (
                            <section className="hidden-screener-total-container">
                                <NavLink className="screener-total-show-btn" onClick={handleShowTotalGrowth}>
                                    Show
                                </NavLink>
                            </section>
                        ) : null
                    }
                </section>
            </section>
        </section>
    )
}