import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, getAllStocksInListThunk, removeListThunk } from "../../redux/list"
import "./List.css"
import { NavLink, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";

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

    if (!listStockData || !lists) {
        return <Loading />
    }

    return (
        <section className="page-container">
            <section className="page-content-container">
                <h1 className="page-title">{list.listName}</h1>
                <section className="list-tabs-container">
                    {stockSymbols?.map((eachSymbol, index) => (
                        <NavLink to={`/search/${eachSymbol}`} className="list-tab" key={index}>
                            <h2 className="list-tab-title">{listStockData[eachSymbol]?.ticker}</h2>
                        </NavLink>
                    ))}
                </section>
            </section>
        </section>
    );
}