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
                <section className="list-tabs-container">
                    {stockSymbols?.map((eachSymbol, index) => (
                        <section className="list-three-dots-container" key={index}>
                            <NavLink to={`/search/${eachSymbol}`} className={`stock-tab ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'green-border' : 'red-border'}`}>
                                <h2 className={`stock-tab-title ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'is-green' : 'is-red'}`}>
                                    {listStockData[eachSymbol]?.ticker}
                                </h2>
                                <div className="stock-tab-title">
                                    <h2 className={`stock-tab-price ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'is-green' : 'is-red'}`}>
                                        {listStockData[eachSymbol]?.current_price?.toFixed(2)}
                                    </h2>
                                    {listStockData[eachSymbol]?.current_price && listStockData[eachSymbol]?.info?.previousClose ?
                                        (listStockData[eachSymbol].current_price > listStockData[eachSymbol].info.previousClose ?
                                            (<div className="stock-tab-title stock-tab-up-arrow">
                                                <GoTriangleUp />
                                            </div>) :
                                            (<div className="stock-tab-title stock-tab-down-arrow">
                                                <GoTriangleDown />
                                            </div>)
                                        ) : null
                                    }
                                    <p className={`stock-tab-percentage ${listStockData[eachSymbol]?.current_price > listStockData[eachSymbol]?.info?.previousClose ? 'is-green' : 'is-red'}`}>
                                        {listStockData[eachSymbol]?.current_price && listStockData[eachSymbol]?.info?.previousClose ?
                                            `${(((listStockData[eachSymbol].current_price - listStockData[eachSymbol].info.previousClose) / listStockData[eachSymbol].info.previousClose) * 100).toFixed(2)}%`
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
                        </section>
                    ))}
                </section>
            </section>
        </section>
    );
}