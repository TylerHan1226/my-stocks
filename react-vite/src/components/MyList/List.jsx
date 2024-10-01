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
    const listStockData = useSelector(state => state.lists?.stocks_data)
    const stockSymbols = lists?.filter(ele => ele.list_name == list?.listName).map(ele => ele.stock_symbol)
    const [isLoading, setIsLoading] = useState(true)
    const [isScreenerOn, setIsScreenerOn] = useState(false)

    console.log('listStockData ==>', listStockData)

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
                    {isScreenerOn &&
                        <div className="screener-headers">
                            <p className="text-w-screener">Symbol</p>
                            <p className="text-w-screener">Type</p>
                            <p className="text-w-screener">Current Price</p>
                            <p className="text-w-screener">Dividend Yield</p>
                            <p className="text-w-screener">Period</p>
                            <p className="text-w-screener">Current Dividend Rate</p>
                        </div>}
                    {stockSymbols?.map((eachSymbol, index) => {

                        const stockCurrentPrice = listStockData[eachSymbol]?.currentPrice?.toFixed(2)
                        const stockPreviousClosing = listStockData[eachSymbol]?.info?.previousClose
                        const isStockGreen = stockCurrentPrice > stockPreviousClosing
                        const quoteType = listStockData[eachSymbol]?.info?.sector || listStockData[eachSymbol]?.info?.quoteType
                        const stockDividendYield = typeof((listStockData[eachSymbol]?.info?.dividendYield * 100)?.toFixed(2)) == 'number' ? (listStockData[eachSymbol]?.info?.dividendYield * 100)?.toFixed(2) : (listStockData[eachSymbol]?.info?.yield * 100)?.toFixed(2)
                        const stockDividendRate  = listStockData[eachSymbol]?.info?.dividendRate?.toFixed(2) || 'N/A'

                        return (
                            <section className="list-three-dots-container" key={index}>
                                <button className="list-screener-period-btn"
                                    onClick={handleScreenerPeriod}>
                                    Years
                                </button>
                                <NavLink to={`${isScreenerOn ? '' : '/search/${eachSymbol}'}`} className={`${isScreenerOn ? 'stock-tab-w-screener' : 'stock-tab'}  ${isStockGreen ? 'green-border' : 'red-border'}`}>
                                    <h2 className={`${isScreenerOn ? 'text-w-screener' : 'stock-tab-title'} ${isStockGreen ? 'is-green' : 'is-red'}`}>
                                        {eachSymbol}
                                    </h2>
                                    {isScreenerOn &&
                                        <div className="screener-texts-container">
                                            <p className={`text-w-screener`}>
                                                {quoteType}
                                            </p>
                                            <p className={`text-w-screener`}>
                                                {stockCurrentPrice}
                                            </p>
                                            <p className={`text-w-screener`}>
                                                {stockDividendYield}
                                            </p>
                                            <p className={`text-w-screener`}>
                                                period
                                            </p>
                                            <p className={`text-w-screener`}>
                                                {stockDividendRate}
                                            </p>
                                        </div>
                                    }
                                    <div className="stock-tab-title">
                                        {!isScreenerOn &&
                                            <h2 className={`${isScreenerOn ? 'text-w-screener' : 'stock-tab-price'} ${isStockGreen ? 'is-green' : 'is-red'}`}>
                                                {stockCurrentPrice}
                                            </h2>}
                                        {stockCurrentPrice && stockPreviousClosing && !isScreenerOn ?
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
                                            {stockCurrentPrice && stockPreviousClosing && !isScreenerOn ?
                                                `${(((stockCurrentPrice - stockPreviousClosing) / stockPreviousClosing) * 100).toFixed(2)}%`
                                                : null
                                            }
                                        </p>
                                    </div>
                                </NavLink>
                                {!isScreenerOn &&
                                    <div className="three-dot-btn">
                                        <OpenModalMenuItem
                                            itemText={<BsThreeDotsVertical />}
                                            className="three-dots"
                                            modalComponent={
                                                <StockOptionModal
                                                    stockSymbol={eachSymbol}
                                                />}
                                        />
                                    </div>}
                            </section>
                        )
                    })}
                </section>
            </section>
        </section>
    );
}