import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMyListsThunk, getAllMyStocksThunk, getAllStocksInListThunk } from "../../redux/list";
import { getMultipleStocksThunk } from "../../redux/stock";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { makeChartSmall } from "../Helper/Helper";

Chart.register(annotationPlugin);

export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const lists = useSelector(state => state.lists?.My_Lists)
  const landingStocks = useSelector(state => state.stocks?.multiple_stocks)
  const chartRefs = useRef([])
  const chartInstances = useRef([])
  const allMyStocks = useSelector(state => state.lists?.stocks_data)
  
  const allStockSymbols = new Set()
  lists?.forEach(ele => {
    allStockSymbols.add(ele.stock_symbol)
  })
  const allStockSymbolList = Array.from(allStockSymbols)
  // get top gainers and losers
  const myTopGainers = [];
  const myTopLosers = [];
  if (allMyStocks) {
    allStockSymbolList.forEach(ele => {
      if (allMyStocks[ele]) {
        allMyStocks[ele].current_price > allMyStocks[ele].open ? myTopGainers.push(allMyStocks[ele]) : myTopLosers.push(allMyStocks[ele]);
      }
    });
  }
  myTopGainers.sort((a, b) => b.current_price - b.open - (a.current_price - a.open));
  console.log('myTopGainers ==>', myTopGainers);
  console.log('myTopLosers ==>', myTopLosers);

  const landingStocksSymbols = ["^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F"]
  useEffect(() => {
    dispatch(getAllMyListsThunk())
    dispatch(getMultipleStocksThunk(landingStocksSymbols))
    dispatch(getAllMyStocksThunk())
  }, [dispatch, user])

  useEffect(() => {
    if (landingStocks) {
      landingStocksSymbols.forEach((symbol, index) => {
        if (landingStocks[symbol]?.historical_data_1d && chartRefs.current[index]) {
          if (!chartInstances.current[index]) {
            chartInstances.current[index] = { current: null }
          }
          const stockCurrentPrice = landingStocks[symbol]?.currentPrice
          const stockLastClosePrice = landingStocks[symbol]?.info?.previousClose
          const isGreen = stockCurrentPrice > stockLastClosePrice ? true : false
          makeChartSmall('historical_data_1d', landingStocks[symbol], chartInstances.current[index], chartRefs.current[index], isGreen)
        }
      })
    }
  }, [landingStocks])

  return (
    <section className="page-container">
      <section className="page-content-container">
        <section className="landing-container">

          {user &&
            <div className="landing-content">
              <div className="landing-gainer-loser-container">
                <h2>My Top Gainers</h2>
                {myTopGainers?.map((eachList) => (
                  <div key={eachList?.ticker}>
                    <p>{eachList?.ticker}: {eachList?.current_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="landing-gainer-loser-container">
                <h2>My Top Losers</h2>
                {myTopLosers?.map((eachList) => (
                  <div key={eachList?.ticker}>
                    <p>{eachList?.ticker}: {eachList?.current_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

          }

          <section className="landing-content">
            <h2>Market</h2>
            <div className="landing-stocks-container">

              <div className="landing-stocks-3tab-container">
                {landingStocksSymbols?.slice(0, 3)?.map((eachSymbol, index) => (
                  <div className="landing-stock-tab" key={eachSymbol}>
                    <p>{landingStocks?.[eachSymbol]?.name}</p>
                    <p>{landingStocks?.[eachSymbol]?.currentPrice.toFixed(2)}</p>
                    <canvas className="stock-sparkline-chart-small" ref={el => chartRefs.current[index] = el}></canvas>
                  </div>
                ))}
              </div>

              <div className="landing-stocks-3tab-container">
                {landingStocksSymbols?.slice(3, 6)?.map((eachSymbol, index) => (
                  <div className="landing-stock-tab" key={eachSymbol}>
                    <p>{landingStocks?.[eachSymbol]?.name}</p>
                    <p>{landingStocks?.[eachSymbol]?.currentPrice.toFixed(2)}</p>
                    <canvas className="stock-sparkline-chart-small" ref={el => chartRefs.current[index + 3] = el}></canvas>
                  </div>
                ))}
              </div>

            </div>
          </section>

          <div className="landing-content">
            <h2>Market News</h2>
            <h2>MyNews</h2>
          </div>



        </section>

      </section>
    </section>
  );
}
