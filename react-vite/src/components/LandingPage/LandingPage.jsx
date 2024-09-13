import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMyListsThunk } from "../../redux/list";
import { getMultipleStocksThunk } from "../../redux/stock";

export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const lists = useSelector(state => state.lists?.My_Lists)
  const landingStocks = useSelector(state => state.stocks?.multiple_stocks)

  console.log('lists ==>', lists)
  console.log('landingStocks ==>', landingStocks)

  const landingStocksSymbols = ["^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F"]
  useEffect(() => {
    dispatch(getAllMyListsThunk())
    dispatch(getMultipleStocksThunk(landingStocksSymbols))
  }, [dispatch, user])

  return (
    <section className="page-container">
      <section className="page-content-container">
        <h1 className="page-title">Landing</h1>

        <section className="landing-container">

          {user &&
            <div className="landing-content">
              <h2>My List</h2>
              {lists?.map((eachList) => (
                <div key={eachList?.id}>
                  <p>{eachList?.list_name}: {eachList?.stock_symbol}</p>
                </div>
              ))}
            </div>
          }

          <section className="landing-content">
            <h2>Market</h2>
            <div className="landing-stocks-container">

              <div className="landing-stocks-3tab-container">
                {landingStocksSymbols?.slice(0, 3)?.map((eachSymbol) => (
                  <div className="landing-stock-tab" key={eachSymbol}>
                    <p>{landingStocks?.[eachSymbol]?.name}</p>
                  </div>
                ))}
              </div>

              <div className="landing-stocks-3tab-container">
                {landingStocksSymbols?.slice(3, 6)?.map((eachSymbol) => (
                  <div className="landing-stock-tab" key={eachSymbol}>
                    <p>{landingStocks?.[eachSymbol]?.name}</p>
                  </div>
                ))}
              </div>
              
            </div>
          </section>

          <div className="landing-content">
            <h2>News</h2>
          </div>

        </section>

      </section>
    </section>
  );
}
