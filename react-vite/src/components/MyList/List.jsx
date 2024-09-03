import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, getAllStocksInListThunk, removeListThunk } from "../../redux/list"
import "./List.css"
import { NavLink, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import { HiArrowCircleUp, HiArrowCircleDown } from "react-icons/hi";

export default function List() {
    const dispatch = useDispatch();
    const list = useParams()
    const lists = useSelector(state => state.lists?.My_Lists)
    const listStockData = useSelector(state => state.lists?.stocks_data)
    const stockSymbols = lists?.filter(ele => ele.list_name == list?.listName).map(ele => ele.stock_symbol)

    console.log('stockSymbols =>', stockSymbols)
    console.log('lists =>', lists)
    console.log("list?.listName =>", list?.listName)
    console.log("listStockData =>", listStockData)

    useEffect(() => {
        dispatch(getAllMyListsThunk())
        dispatch(getAllStocksInListThunk(list?.listName))
    }, [dispatch]);

    if (!listStockData || !lists || !list) {
        return <Loading />
    }

    return (
        <section className="page-container">
            {lists ? (<section className="page-content-container">
                <h1 className="page-title">{list.listName}</h1>
                <section className="list-tabs-container">
                    {stockSymbols?.map((eachSymbol, index) => (
                        <NavLink to={`/search/${eachSymbol}`} className={`stock-tab ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'green-border' : 'red-border'}`} key={index}>
                            <h2 className={`stock-tab-title ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'is-green' : 'is-red'}`}>
                                {listStockData[eachSymbol]?.ticker}
                            </h2>
                            <h2 className={`stock-tab-title ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'is-green' : 'is-red'}`}>
                                {listStockData[eachSymbol]?.current_price?.toFixed(2)}
                            </h2>
                            {listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ?
                                (<div className="stock-tab-title stock-tab-up-arrow">
                                    <HiArrowCircleUp />
                                </div>) : (<div className="stock-tab-title stock-tab-down-arrow">
                                    <HiArrowCircleDown />
                                </div>)
                            }
                        </NavLink>
                    ))}
                </section>
            </section>) : (
                <section className="page-content-container">
                    <h1 className="page-title">Create your Lists!</h1>
                </section>
            )}
        </section>
    );
}