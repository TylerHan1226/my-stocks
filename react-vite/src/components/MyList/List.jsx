import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, getAllStocksInListThunk } from "../../redux/list"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import StockOptionModal from "./StockOptionModal";
import Loading from "../Loading/Loading";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

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


    const handleShowScreener = () => {
        console.log('handleShowScreener clicked !!')
        setIsScreenerOn(prev => !prev)
        console.log('isScreenerOn ==>', isScreenerOn)
    }
    const handleScreenerSettings = () => {
        console.log('handleScreenerSettings clicked !!')
    }
    const handleScreenerPeriod = () => {
        console.log('handleScreenerPeriod clicked !!')
    }
    const handleHistoricalDividend = () => {
        console.log('handleHistoricalDividend clicked !!')
    }

    useEffect(() => {
        dispatch(getAllMyListsThunk())
        dispatch(getAllStocksInListThunk(list?.listName))
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [dispatch]);

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
                {isScreenerOn &&
                    <section className="screener-header-container">
                        <p className="screener-header-texts-type">Type</p>
                        <p className="screener-header-texts">Trailing P/E</p>
                        <p className="screener-header-texts">Forward P/E</p>
                        <p className="screener-header-texts">Current Price</p>
                        <p className="screener-header-texts">Historical Price</p>
                        <p className="screener-header-texts">Dividend Yield</p>
                        <p className="screener-header-texts">Current Dividend</p>
                        <p className="screener-header-texts">Historical Dividend</p>
                        <p className="screener-header-texts">Yearly Dividend Growth</p>
                        <p className="screener-header-texts">Earning Per Share</p>
                        <p className="screener-header-texts">Payout Ratio</p>
                    </section>}
                <section className="list-content-container">
                    {isScreenerOn &&
                        <section className="screener-action-container">

                            {stockSymbols?.map((eachSymbol, index) => {
                                const stock = listStockData[eachSymbol]
                                let stockPeriod = stock?.historical_data_10yr?.length > 0 ? 'historical_data_10yr' : stock?.historical_data_5yr?.length > 0 ? 'historical_data_5yr' : stock?.historical_data_1yr?.length ? 'historical_data_1yr' : stock?.historical_data_6mo?.length ? 'historical_data_6mo' : ''
                                const stockPeriodText = stockPeriod?.split('_')[2]
                                return (
                                    <div className="screener-action-tabs" key={index}>
                                        <p className="screener-texts-symbol">{eachSymbol}</p>
                                        <button className="screener-period-btn"
                                            onClick={handleScreenerPeriod}>
                                            {stockPeriodText}
                                        </button>
                                    </div>

                                )
                            })}
                        </section>}

                    <section className={`${isScreenerOn ? 'list-tabs-container-w-screener' : 'list-tabs-container'}`}>

                        {stockSymbols?.map((eachSymbol, index) => {
                            const stock = listStockData[eachSymbol]
                            const stockCurrentPrice = stock?.currentPrice?.toFixed(2)
                            const stockPreviousClosing = stock?.info?.previousClose
                            const stockTrPE = stock?.info?.trailingPE?.toFixed(2)
                            const stockFwPE = stock?.info?.forwardPE?.toFixed(2)
                            const isStockGreen = stockCurrentPrice > stockPreviousClosing
                            const quoteType = stock?.info?.sector || stock?.info?.quoteType
                            const stockDividendYield = (stock?.info?.dividendYield * 100)?.toFixed(2)
                            const stockYield = (stock?.info?.yield * 100)?.toFixed(2)
                            const stockDividendRate = parseFloat(stock?.info?.dividendRate?.toFixed(2))
                            const stockHistoricalDividendRate = selectedLists?.filter(ele => ele.stock_symbol == eachSymbol)[0]?.historical_dividend
                            const stockEps = stock?.info?.trailingEps?.toFixed(2)

                            let stockPeriod = stock?.historical_data_10yr?.length > 0 ? 'historical_data_10yr' : stock?.historical_data_5yr?.length > 0 ? 'historical_data_5yr' : stock?.historical_data_1yr?.length ? 'historical_data_1yr' : stock?.historical_data_6mo?.length ? 'historical_data_6mo' : ''
                            const stockPeriodText = stockPeriod?.split('_')[2]
                            const stockHistoricalPrice = stock[stockPeriod][0]?.toFixed(2)
                            const stockPayoutRatio = (stock?.info?.payoutRatio * 100)?.toFixed(2)

                            const inputPeriod = stockPeriodText == '10yr' ? 10 : stockPeriodText == '5yr' ? 5 : stockPeriodText == '1yr' ? 1 : stockPeriodText == '6mo' ? 0.5 : null
                            function getYearlyDividendGrowth(startDividend, endDividend, periods) {
                                if (startDividend) return (Math.pow((endDividend / startDividend), 1 / periods) - 1)?.toFixed(2)
                            }
                            const stockYearlyDividendGrowth = getYearlyDividendGrowth(stockHistoricalDividendRate, stockDividendRate, inputPeriod)

                            return (
                                <section key={index}>
                                    {isScreenerOn ?
                                        <section className="screener-container">

                                            <div className="screener-stock-tabs">
                                                <p className={`screener-texts`}>
                                                    {quoteType}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockTrPE ? stockTrPE : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockFwPE ? stockFwPE : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {`$${stockCurrentPrice}`}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {`$${stockHistoricalPrice}`}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockDividendYield != 'NaN' ? `${stockDividendYield}%` : stockYield != 'NaN' ? `${stockYield} %` : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockDividendRate > 0 ? `$${stockDividendRate}` : '-'}
                                                </p>
                                                <div className="screener-label-historical-dividend">
                                                <p className={`screener-texts-historical-dividend`}>
                                                    {stockHistoricalDividendRate > 0 ? `$${stockHistoricalDividendRate}` : '-'}
                                                </p>
                                                <button className="screener-plus-btn"
                                                    onClick={handleHistoricalDividend}>
                                                    +
                                                </button>
                                                </div>
                                                <p className={`screener-texts`}>
                                                    {stockYearlyDividendGrowth ? `$${stockYearlyDividendGrowth}` : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockEps > 0 ? `$${stockEps}` : '-'}
                                                </p>
                                                <p className={`screener-texts`}>
                                                    {stockPayoutRatio > 0 ? `${stockPayoutRatio}%` : '-'}
                                                </p>

                                            </div>
                                            
                                        </section> :

                                        <section className="list-three-dots-container">
                                            <NavLink className={`stock-tab ${isStockGreen ? 'green-border' : 'red-border'}`}>
                                                <h2 className={`stock-tab-title ${isStockGreen ? 'is-green' : 'is-red'}`}>
                                                    {eachSymbol}
                                                </h2>
                                                <div className="stock-tab-title">
                                                    <h2 className={`${isScreenerOn ? 'text-w-screener' : 'stock-tab-price'} ${isStockGreen ? 'is-green' : 'is-red'}`}>
                                                        {stockCurrentPrice}
                                                    </h2>
                                                    {stockCurrentPrice && stockPreviousClosing ?
                                                        (isStockGreen ?
                                                            (<div className="stock-tab-title stock-tab-up-arrow">
                                                                <GoTriangleUp />
                                                            </div>) :
                                                            (<div className="stock-tab-title stock-tab-down-arrow">
                                                                <GoTriangleDown />
                                                            </div>)
                                                        ) : null
                                                    }
                                                    <p className={`stock-tab-percentage ${isStockGreen ? 'is-green' : 'is-red'}`}>
                                                        {stockCurrentPrice && stockPreviousClosing ?
                                                            `${(((stockCurrentPrice - stockPreviousClosing) / stockPreviousClosing) * 100).toFixed(2)}%`
                                                            : null
                                                        }
                                                    </p>
                                                </div>
                                            </NavLink>
                                            <div className="three-dot-btn">
                                                <OpenModalMenuItem
                                                    itemText={<BsThreeDotsVertical />}
                                                    className="three-dots"
                                                    modalComponent={
                                                        <StockOptionModal
                                                            stockSymbol={eachSymbol}
                                                        />}
                                                />
                                            </div>
                                        </section>}
                                </section>)
                        })}
                    </section>
                </section>

            </section>
        </section>
    )
}