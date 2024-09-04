import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


import Loading from "../Loading/Loading";
import { getOneStockThunk } from "../../redux/stock";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import AddListModal from "../MyList/AddListModal";


export default function SearchPage() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { searchInput } = useParams()
    const user = useSelector(state => state.session.user)
    const stock = useSelector(state => state.stocks)

    console.log("stock ==>", stock)

    if (!user) {
        return nav('/')
    }

    useEffect(() => {
        dispatch(getOneStockThunk(searchInput))
        window.scrollTo(0, 0)
    }, [nav, dispatch, searchInput])

    return (
        <section className="page-container">
            <section className="page-content-container">
                <h1 className="page-title">{stock?.name}</h1>
                <div className="stock-page-action-btn-container">
                    <div className="stock-page-action-btns">
                        <OpenModalMenuItem
                        className="stock-page-add-btn"
                        itemText="ADD TO LIST"
                        modalComponent={<AddListModal />}
                        />
                    </div>
                </div>
                <section className="search-info-container">
                    <h2>About</h2>
                    <div className="search-info-boxes">
                        <p className="">{stock?.info?.longBusinessSummary}</p>
                        <div className="search-info-texts-container">
                            {stock?.info?.companyOfficers &&
                                <p className="search-info-text">
                                    CEO: {stock?.info?.companyOfficers?.filter(ele => ele.title.includes("CEO"))[0]?.name}
                                </p>
                            }
                            {stock?.info?.fullTimeEmployees &&
                                <p className="search-info-text">
                                    Full-time Employees: {stock?.info?.fullTimeEmployees}
                                </p>
                            }
                            {stock?.info?.city && stock?.info?.state &&
                                <p className="search-info-text">
                                    Headquaters: {stock?.info?.city}, {stock?.info?.state}
                                </p>
                            }
                        </div>
                    </div>
                    <h2>Key Statistics</h2>
                    <div className="search-info-boxes">
                        <div className="search-info-texts-container">
                            <p className="search-info-text">
                                Current Price: {stock?.currentPrice?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                Open price: {stock?.info?.previousClose?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                Previous close price: {stock?.info?.open?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                Market cap: {stock?.info?.marketCap > 1000000000000
                                    ? (stock?.info?.marketCap / 1000000000000)?.toFixed(2) + 'T'
                                    : stock?.info?.marketCap > 1000000000
                                        ? (stock?.info?.marketCap / 1000000000)?.toFixed(2) + 'B'
                                        : (stock?.info?.marketCap / 1000000)?.toFixed(2) + 'M'}
                            </p>
                            <p className="search-info-text">
                                Price-Earning ratio: {stock?.info?.trailingPE?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                Forward Price-Earning ratio: {stock?.info?.forwardPE?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                Volume: {stock?.info?.volume > 1000000000000
                                    ? (stock?.info?.volume / 1000000000000)?.toFixed(2) + 'T'
                                    : stock?.info?.volume > 1000000000
                                        ? (stock?.info?.volume / 1000000000)?.toFixed(2) + 'B'
                                        : (stock?.info?.volume / 1000000)?.toFixed(2) + 'M'}
                            </p>
                            {stock?.info?.dividendYield ? (
                                <p className="search-info-text">
                                    Dividend Yield: {(stock?.info?.dividendYield * 100)?.toFixed(2)}%
                                </p>
                            ) : stock?.info?.yield ? (
                                <p className="search-info-text">
                                    Dividend Yield: {(stock?.info?.yield * 100)?.toFixed(2)}%
                                </p>    
                            ) : (
                                <p className="search-info-text">
                                    Dividend Yield: N/A
                                </p>    
                            )}

                            <p className="search-info-text">
                                High today: {stock?.info?.dayHigh?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                Low today: {stock?.info?.dayLow?.toFixed(2)}
                            </p>
                            {/* {stock?.info?.lastDividendValue ? (
                                <p className="search-info-text">
                                    Last Divided Value: ${stock?.info?.lastDividendValue}
                                </p>
                            ) : (
                                <p className="search-info-text">
                                    Last Divided Value: N/A
                                </p>
                            )} */}
                            <p className="search-info-text">
                                52 Week high: {stock?.info?.fiftyTwoWeekHigh?.toFixed(2)}
                            </p>
                            <p className="search-info-text">
                                52 Week low: {stock?.info?.fiftyTwoWeekLow?.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </section>
            </section>
        </section>

    );
}
