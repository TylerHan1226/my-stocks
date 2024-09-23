import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { makeChartSmall } from "../Helper/Helper";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import Loading from "../Loading/Loading";
import { NavLink } from "react-router-dom";
import { getAllMyListsThunk } from "../../redux/list";
import { getMultipleStocksThunk } from "../../redux/stock";
import { getMarketNewsThunk, getMyNewsThunk } from "../../redux/news";

Chart.register(annotationPlugin);

export default function LandingPage() {

  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const lists = useSelector(state => state.lists?.My_Lists)
  const landingStocks = useSelector(state => state.stocks?.multiple_stocks)
  const marketNews = useSelector(state => state.news?.market_news)
  const myNews = useSelector(state => state.news?.my_news)
  const chartRefs = useRef([])
  const chartInstances = useRef([])
  const prevAllMyStocksSymbolArr = useRef([])
  const allMyStocksSymbols = new Set(lists?.map(ele => ele.stock_symbol))
  const allMyStocksSymbolArr = Array.from(allMyStocksSymbols)
  const [isLoading, setIsLoading] = useState(true)
  const marketSymbols = ["^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F"]
  const landingStocksSymbols = marketSymbols.concat(allMyStocksSymbolArr)

  // const [showMarket, setShowMarket] = useState(true)
  // const [showMyStocks, setShowMyStocks] = useState(true)
  // const handleMarket = () => {
  //   setShowMarket(prev => !prev)
  // }
  // const handleMyStocks = () => {
  //   setShowMyStocks(prev => !prev)
  // }
  // const isDisableMarket = showMarket == true && showMyStocks == false
  // const isDisableMyStock = showMarket == false && showMyStocks == true

  useEffect(() => {
    dispatch(getAllMyListsThunk())
    dispatch(getMarketNewsThunk())
  }, [dispatch, user])

  useEffect(() => {
    if (user && JSON.stringify(prevAllMyStocksSymbolArr.current) !== JSON.stringify(allMyStocksSymbolArr)) {
      dispatch(getMultipleStocksThunk(landingStocksSymbols))
      prevAllMyStocksSymbolArr.current = allMyStocksSymbolArr
      dispatch(getMyNewsThunk(allMyStocksSymbolArr))
    }
  }, [dispatch, user, allMyStocksSymbolArr, landingStocksSymbols])

  // get top gainers and losers
  const myTopGainers = []
  const myTopLosers = []
  if (landingStocks && allMyStocksSymbolArr) {
    allMyStocksSymbolArr.forEach(ele => {
      const stock = landingStocks[ele]
      if (stock.currentPrice > stock.info.previousClose) {
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
  const createChart = (symbol, index, chartIndex) => {
    if (landingStocks[symbol]?.historical_data_1d && chartRefs.current[chartIndex]) {
      if (!chartInstances.current[chartIndex]) {
        chartInstances.current[chartIndex] = { current: null }
      }
      const stockCurrentPrice = landingStocks[symbol]?.currentPrice
      const stockLastClosePrice = landingStocks[symbol]?.info?.previousClose
      const isGreen = stockCurrentPrice > stockLastClosePrice
      makeChartSmall('historical_data_1d', landingStocks[symbol], chartInstances.current[chartIndex], chartRefs.current[chartIndex], isGreen)
    }
  }
  // Stock tabs
  const stockElement = (symbols, offset = 0) => {
    return symbols?.map((eachSymbol, index) => {
      const percentage = ((((landingStocks?.[eachSymbol]?.currentPrice - landingStocks?.[eachSymbol]?.info.previousClose)) / landingStocks?.[eachSymbol]?.info.previousClose) * 100).toFixed(2)
      return (
        <div className="landing-stock-tab" key={index}>
          <h4 className="landing-stock-text">{landingStocks?.[eachSymbol]?.name}</h4>
          <div className="landing-stock-percentage-container">
            <p className="landing-stock-text">{landingStocks?.[eachSymbol]?.currentPrice.toFixed(2)}</p>
            <p className={`landing-stock-text ${percentage > 0 ? 'is-green' : 'is-red'}`}>{percentage}%</p>
            {percentage > 0 ? <p className="is-green landing-stock-text"><GoTriangleUp className="landing-stock-arrow" /></p> : <p className="is-red landing-stock-text"><GoTriangleDown className="landing-stock-arrow" /></p>}
          </div>
          <NavLink to={`/search/${eachSymbol}`}>
            <canvas className="stock-sparkline-chart-small" ref={el => chartRefs.current[offset + index] = el}></canvas>
          </NavLink>
        </div>
      )
    })
  }

  useEffect(() => {
    if (landingStocks) {
      // Create charts for market symbols
      marketSymbols.forEach((symbol, index) => {
        createChart(symbol, index, index)
      })
      // Create charts for top gainers
      myTopGainerSymbols.forEach((symbol, index) => {
        const chartIndex = marketSymbols.length + index
        createChart(symbol, index, chartIndex)
      })
      // Create charts for top losers
      myTopLoserSymbols.forEach((symbol, index) => {
        const chartIndex = marketSymbols.length + myTopGainers.length + index
        createChart(symbol, index, chartIndex)
      })
      setIsLoading(false)
    }
    window.scrollTo(0, 0)
  }, [user, landingStocks, landingStocksSymbols, allMyStocksSymbolArr, myTopGainers, myTopLosers])


  if (!user) {
    return (
      <section className="page-container">
        <section className="page-content-container">
          <h1>Please Log In to Start</h1>
        </section>
      </section>
    )
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
        <section className="landing-container">

          <section className="landing-news-content">


              <div className="landing-info-tabs">
                <h2>Market News</h2>
                <section className="landing-news-container">
                  {marketNews?.length > 0 && marketNews?.slice(0, 10)?.map((ele, index) => (
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
              


              <div className="landing-info-tabs">
                <h2>My News</h2>
                <section className="landing-news-container">
                  {myNews?.length > 0 && myNews?.slice(0, 10)?.map((ele, index) => (
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

          </section>

          <section className="landing-stock-content">


              <div className="landing-info-tabs">
                <h2>Market</h2>
                <section className="landing-3stocks-container">
                  <div className="landing-3stocks">
                    {stockElement(marketSymbols.slice(0, 3))}
                  </div>
                  <div className="landing-3stocks">
                    {stockElement(marketSymbols.slice(3, 6), 3)}
                  </div>
                </section>
              </div>


              <div className="landing-info-tabs">
                <section className="landing-3stocks-container">
                  <div className="landing-3stocks">
                    <h2 className="landing-gainer-loser-title">My Top Gainers</h2>
                    {stockElement(myTopGainerSymbols, marketSymbols.length)}
                  </div>
                  <div className="landing-3stocks">
                    <h2 className="landing-gainer-loser-title">My Top Losers</h2>
                    {stockElement(myTopLoserSymbols, marketSymbols.length + myTopGainers.length)}
                  </div>
                </section>
              </div>

          </section>

          {/* <section className="landing-btn-container">
            <button className={`stock-page-action-btn ${showMarket ? 'is-background-green' : ''}`}
              onClick={handleMarket}
              disabled={isDisableMarket}
              >
              Market
            </button>
            <button className={`stock-page-action-btn ${showMyStocks ? 'is-background-green' : ''}`}
              onClick={handleMyStocks}
              disabled={isDisableMyStock}
              >
              My Stocks
            </button>
          </section> */}

        </section>
      </section>
    </section>
  );
}
