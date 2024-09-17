import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getAllMyListsThunk } from "../../redux/list";
import { getMultipleStocksThunk } from "../../redux/stock";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { makeChartSmall } from "../Helper/Helper";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import Loading from "../Loading/Loading";
import { NavLink } from "react-router-dom";

Chart.register(annotationPlugin);

export default function LandingPage() {

  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const lists = useSelector(state => state.lists?.My_Lists)
  const landingStocks = useSelector(state => state.stocks?.multiple_stocks)
  const chartRefs = useRef([])
  const chartInstances = useRef([])
  const prevAllMyStocksSymbolArr = useRef([])
  const allMyStocksSymbols = new Set(lists?.map(ele => ele.stock_symbol))
  const allMyStocksSymbolArr = Array.from(allMyStocksSymbols)
  const [isLoading, setIsLoading] = useState(true)

  const marketSymbols = ["^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F"]
  const landingStocksSymbols = marketSymbols.concat(allMyStocksSymbolArr)

  useEffect(() => {
    dispatch(getAllMyListsThunk())
  }, [dispatch])

  useEffect(() => {
    if (user && JSON.stringify(prevAllMyStocksSymbolArr.current) !== JSON.stringify(allMyStocksSymbolArr)) {
      console.log('landingStocksSymbols ==>', landingStocksSymbols)
      dispatch(getMultipleStocksThunk(landingStocksSymbols))
      prevAllMyStocksSymbolArr.current = allMyStocksSymbolArr
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
  myTopLosers.sort((a, b) => a.currentPrice / (a.currentPrice - a.info.previousClose) - b.currentPrice / (b.currentPrice - b.info.previousClose))
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

  useEffect(() => {
    if (landingStocks) {
      // Create charts for market symbols
      marketSymbols.forEach((symbol, index) => {
        createChart(symbol, index, index)
      });
      // Create charts for top gainers
      myTopGainerSymbols.forEach((symbol, index) => {
        const chartIndex = marketSymbols.length + index
        createChart(symbol, index, chartIndex)
      });
      // Create charts for top losers
      myTopLoserSymbols.forEach((symbol, index) => {
        const chartIndex = marketSymbols.length + myTopGainers.length + index
        createChart(symbol, index, chartIndex)
      })
      setIsLoading(false)
    }
    window.scrollTo(0, 0)
  }, [landingStocks, landingStocksSymbols, allMyStocksSymbolArr, myTopGainers, myTopLosers])

  if (isLoading) {
    return <Loading />
  }

  const stockElement = (symbols, offset = 0) => {
    return symbols?.map((eachSymbol, index) => {
      const percentage = ((((landingStocks?.[eachSymbol]?.currentPrice - landingStocks?.[eachSymbol]?.info.previousClose)) / landingStocks?.[eachSymbol]?.info.previousClose) * 100).toFixed(2);
      return (
        <div className="landing-stock-tab" key={eachSymbol}>
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
      );
    });
  }


  return (
    <section className="page-container">
      <section className="page-content-container">
        
          <section className="landing-container">
          {user && <section className="landing-content">
              <div className="landing-stocks-container">
                <div className="">
                  <h2>My Top Gainers</h2>
                  <div className="landing-stocks-3tab-container">
                    {stockElement(myTopGainerSymbols, marketSymbols.length)}
                  </div>
                </div>
                <div className="">
                  <h2>My Top Losers</h2>
                  <div className="landing-stocks-3tab-container">
                    {stockElement(myTopLoserSymbols, marketSymbols.length + myTopGainers.length)}
                  </div>
                </div>
              </div>
            </section>}

            <section className="landing-content">
              <h2>Market News</h2>
              <h2>MyNews</h2>
            </section>

            <section className="landing-content">
              <h2>Market</h2>
              <div className="landing-stocks-container">
                <div className="landing-stocks-3tab-container">
                  {stockElement(marketSymbols.slice(0, 3))}
                </div>
                <div className="landing-stocks-3tab-container">
                  {stockElement(marketSymbols.slice(3, 6), 3)}
                </div>
              </div>
            </section>

          </section>
      </section>
    </section>
  );
}
