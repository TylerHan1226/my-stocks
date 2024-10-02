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
    const handleScreenerPeriod = () => {
        console.log('handleScreenerPeriod clicked !!')
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

                <section className={`${isScreenerOn ? 'list-tabs-container-w-screener' : 'list-tabs-container'}`}>
                    <button className="list-screener-btn"
                        onClick={handleShowScreener}>
                        Show Screeners
                    </button>

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
                        const stockDividendRate = stock?.info?.dividendRate?.toFixed(2)
                        const stockHistoricalDividendRate = selectedLists?.filter(ele => ele.stock_symbol == eachSymbol)[0]?.historical_dividend
                        const stockEps = stock?.info?.trailingEps?.toFixed(2)
                        let stockPeriod = stock?.historical_data_10yr?.length > 0 ? 'historical_data_10yr' : stock?.historical_data_5yr?.length > 0 ? 'historical_data_5yr' : stock?.historical_data_1yr?.length ? 'historical_data_1yr' : stock?.historical_data_6mo?.length ? 'historical_data_6mo' : ''
                        const stockPeriodText = stockPeriod?.split('_')[2]
                        const stockHistoricalPrice = stock[stockPeriod][0]?.toFixed(2)
                        const stockPayoutRatio = (stock?.info?.payoutRatio * 100)?.toFixed(2)
                        // console.log('stock ==>', stock)

                        return (
                            <section key={index}>
                                {isScreenerOn && index == 0 &&
                                    <div className="screener-headers">
                                        {/* <p className="screener-header-text">Symbol</p> */}
                                        <p className="screener-header-text-type">Type</p>
                                        <p className="screener-header-text">Trailing P/E</p>
                                        <p className="screener-header-text">Forward P/E</p>
                                        <p className="screener-header-text">Current Price</p>
                                        <p className="screener-header-text">Historical Price</p>
                                        <p className="screener-header-text">Dividend Yield</p>
                                        <p className="screener-header-text">Current Dividend</p>
                                        <p className="screener-header-text">Historical Dividend</p>
                                        <p className="screener-header-text">Earning Per Share</p>
                                        <p className="screener-header-text">Payout Ratio</p>
                                    </div>}

                                <section className="list-three-dots-container">
                                    {isScreenerOn &&
                                        <div className="screener-symbol-period-container">
                                            <div className="screener-absolute-container">
                                                <p className="text-w-screener-symbol">{`${eachSymbol} (${stockPeriodText})`}</p>
                                            </div>
                                            <button className="list-screener-period-btn"
                                                onClick={handleScreenerPeriod}>
                                                {stockPeriodText}
                                            </button>
                                        </div>}

                                    {isScreenerOn ?
                                        <section className="stock-tab-w-screener">
                                            <div className="screener-texts-container">

                                                <p className={`text-w-screener-type`}>
                                                    {quoteType}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockTrPE ? stockTrPE : 'N/A'}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockFwPE ? stockFwPE : 'N/A'}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {`$${stockCurrentPrice}`}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {`$${stockHistoricalPrice}`}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockDividendYield != 'NaN' ? `${stockDividendYield}%` : stockYield != 'NaN' ? `${stockYield} %` : 'N/A'}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockDividendRate > 0 ? `$${stockDividendRate}` : 'N/A'}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockHistoricalDividendRate > 0 ? `$${stockHistoricalDividendRate}` : 'N/A'}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockEps > 0 ? stockEps : 'N/A'}
                                                </p>
                                                <p className={`text-w-screener`}>
                                                    {stockPayoutRatio > 0 ? `${stockPayoutRatio}%` : 'N/A'}
                                                </p>
                                            </div>
                                        </section> :
                                        <>
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
                                        </>
                                    }
                                </section>
                            </section>
                        )
                    })}
                </section>
            </section>
        </section>
    );
}