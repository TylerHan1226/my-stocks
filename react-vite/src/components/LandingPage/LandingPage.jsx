import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { makeChartSmall } from "../Helper/Helper";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import Loading from "../Loading/Loading";
import { NavLink } from "react-router-dom";
import { getAllMyListsThunk, getAllMyStocksThunk } from "../../redux/list";
import { getMultipleStocksThunk } from "../../redux/stock";
import { getMarketNewsThunk, getMyNewsThunk } from "../../redux/news";

Chart.register(annotationPlugin)

export default function LandingPageBeta() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const lists = useSelector(state => state.lists?.My_Lists)
    const allMyStocksSymbols = Array.from(new Set(lists?.map(ele => ele.stock_symbol)))
    const marketSymbols = ["^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F"]
    const marketStocks = useSelector(state => state.stocks?.multiple_stocks)
    const allMyStocks = useSelector(state => state.lists?.stocks_data)
    const marketNews = useSelector(state => state.news?.market_news)
    const myNews = useSelector(state => state.news?.my_news)

    const [isLoading, setIsLoading] = useState(true)
    // chart refs
    const marketChartRefs = useRef([])
    const marketChartInstances = useRef([])
    const myTopGainerChartRefs = useRef([])
    const myTopGainerChartInstances = useRef([])
    const myTopLoserChartRefs = useRef([])
    const myTopLoserChartInstances = useRef([])
    // get top gainers / losers
    const myTopGainers = []
    const myTopLosers = []
    if (allMyStocks) {
        allMyStocksSymbols?.forEach(ele => {
            const stock = allMyStocks[ele]
            if (stock?.currentPrice > stock?.info?.previousClose) {
                myTopGainers.push(stock)
            } else {
                myTopLosers.push(stock)
            }
        })
    }
    myTopGainers.sort((a, b) => a.currentPrice / (a.currentPrice - a.info.previousClose) - b.currentPrice / (b.currentPrice - b.info.previousClose))
    myTopLosers.sort((a, b) => b.currentPrice / (b.currentPrice - b.info.previousClose) - a.currentPrice / (a.currentPrice - a.info.previousClose))
    const myTopGainerSymbols = myTopGainers?.map(ele => ele?.ticker)?.slice(0, 3)
    const myTopLoserSymbols = myTopLosers?.map(ele => ele?.ticker)?.slice(0, 3)
    // Create Charts
    const chartMaker = (symbols, stocks, chartRefs, chartInstances) => {
        return symbols?.forEach((symbol, index) => {
            const stock = stocks[symbol]
            const isGreen = stock?.currentPrice > stock?.info.previousClose
            if (chartRefs.current[index]) {
                if (!chartInstances.current[index]) {
                    chartInstances.current[index] = { current: null }
                }
                makeChartSmall(stock, chartInstances.current[index], chartRefs.current[index], isGreen)
            }
        })
    }
    // Stock tabs
    const stockElement = (symbols, stocks, chartRefs, chartInstances, offset = 0) => {
        if (!stocks) return
        return symbols?.map((eachSymbol, index) => {
            const percentage = ((((stocks?.[eachSymbol]?.currentPrice - stocks?.[eachSymbol]?.info.previousClose)) / stocks?.[eachSymbol]?.info.previousClose) * 100).toFixed(2)
            return (
                <div className="landing-stock-tab" key={index}>
                    <h4 className="landing-stock-text">{stocks?.[eachSymbol]?.name || eachSymbol}</h4>
                    <div className="landing-stock-percentage-container">
                        <p className="landing-stock-text">
                            {stocks?.[eachSymbol]?.currentPrice?.toFixed(2) || "N/A"}
                        </p>
                        <p className={`landing-stock-text ${percentage > 0 ? 'is-green' : 'is-red'}`}>
                            {percentage || "N/A"}%
                        </p>
                        {percentage > 0 ?
                            <p className="is-green landing-stock-text">
                                <GoTriangleUp className="landing-stock-arrow" />
                            </p> : <p className="is-red landing-stock-text">
                                <GoTriangleDown className="landing-stock-arrow" />
                            </p>}
                    </div>
                    <NavLink
                        to={user ? `/search/${eachSymbol}` : '#'}
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault();
                                alert('Please log in to see stock details');
                            }
                        }}
                    >
                        <canvas
                            ref={el => chartRefs.current[offset + index] = el}
                            className={'landing-small-chart'}
                        ></canvas>
                    </NavLink>
                </div>
            )
        })
    }
    // get my lists, market news, all my stocks, market stocks
    useEffect(() => {
        dispatch(getAllMyListsThunk())
        dispatch(getMarketNewsThunk())
        dispatch(getAllMyStocksThunk())
        dispatch(getMultipleStocksThunk(marketSymbols))
    }, [dispatch, user])
    // get my news
    useEffect(() => {
        if (lists) {
            dispatch(getMyNewsThunk(allMyStocksSymbols))
        }
    }, [dispatch, lists])
    // make market charts
    useEffect(() => {
        setIsLoading(true)
        if (marketStocks) {
            chartMaker(marketSymbols, marketStocks, marketChartRefs, marketChartInstances)
            setIsLoading(false)
        }
    }, [marketStocks, user, marketChartRefs, marketChartInstances, isLoading])
    // make my stocks charts
    useEffect(() => {
        if (myTopGainerSymbols.length > 0) {
            chartMaker(myTopGainerSymbols, allMyStocks, myTopGainerChartRefs, myTopGainerChartInstances)
        }
        if (myTopLoserSymbols.length > 0) {
            chartMaker(myTopLoserSymbols, allMyStocks, myTopLoserChartRefs, myTopLoserChartInstances)
        }
    }, [user, allMyStocks, myTopGainerSymbols, myTopLoserSymbols, myTopGainerChartRefs, myTopGainerChartInstances, myTopLoserChartRefs, myTopLoserChartInstances])

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
                <section className="landing-container">

                    <section className="landing-news-content">

                        <div className="landing-info-tabs">
                            <h2>Market News</h2>
                            <section className="landing-news-container">
                                {marketNews?.map((ele, index) => (
                                    <div className="landing-news-tab" key={index}>
                                        <div className="landing-news-info">
                                            <p>{ele.title}</p>
                                            <div className="landing-news-dtl-info">
                                                <p>{ele.publisher}</p>
                                                <p> | {ele.date?.split('T')[0]} | </p>
                                                <NavLink to={ele.link} target='_blank' className='landing-news-read-more'>
                                                    Read More
                                                </NavLink>
                                            </div>
                                        </div>
                                        <img className="landing-news-img" src={ele.image_url} />
                                    </div>
                                ))}
                            </section>
                        </div>

                        {lists &&
                            <div className="landing-info-tabs">
                                <h2>My News</h2>
                                <section className="landing-news-container">
                                    {myNews ? myNews?.map((ele, index) => (
                                        <div className="landing-news-tab" key={index}>
                                            <div className="landing-news-info">
                                                <p>{ele.title}</p>
                                                <div className="landing-news-dtl-info">
                                                    <p>{ele.publisher}</p>
                                                    <p> | {ele.date?.split('T')[0]} | </p>
                                                    <NavLink to={ele.link} target='_blank' className='landing-news-read-more'>
                                                        Read More
                                                    </NavLink>
                                                </div>
                                            </div>
                                            <img className="landing-news-img" src={ele.image_url} />
                                        </div>
                                    )) : <p>loading...</p>}
                                </section>
                            </div>}

                    </section>

                    <section className="landing-stock-content">
                        <div className="landing-info-tabs">
                            <h2>Market</h2>
                            <section className="landing-3stocks-container">
                                <div className="landing-3stocks-market">
                                    {stockElement(marketSymbols, marketStocks, marketChartRefs, marketChartInstances)}
                                </div>
                            </section>
                        </div>
                        {lists &&
                            <div className="landing-info-tabs">
                                <section className="landing-3stocks-container">
                                    <div className="landing-3stocks">
                                        <h2 className="landing-gainer-loser-title">My Top Gainers</h2>
                                        {allMyStocks ? stockElement(myTopGainerSymbols, allMyStocks, myTopGainerChartRefs, myTopGainerChartInstances) : <p>loading...</p>}
                                    </div>
                                    <div className="landing-3stocks">
                                        <h2 className="landing-gainer-loser-title">My Top Losers</h2>
                                        {allMyStocks ? stockElement(myTopLoserSymbols, allMyStocks, myTopLoserChartRefs, myTopLoserChartInstances) : <p>loading...</p>}
                                    </div>
                                </section>
                            </div>}
                    </section>

                </section>
            </section>
        </section>
    )
}