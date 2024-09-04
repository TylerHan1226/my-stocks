import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { FaHandPointLeft, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { addListThunk, getAllMyListsThunk } from "../../redux/list";

export default function AddListModal() {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const listItems = useSelector(state => state.lists?.My_Lists)
    const stock = useSelector(state => state.stocks)
    const stockSymbol = stock?.ticker

    const listNames = new Set()
    listItems?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    const handleAddList = (listData) => {
        console.log("listData ==>", listData)
        dispatch(addListThunk(listData))
        // closeModal()
    };

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch])

    if (!user) {
        return nav('/')
    }

    return (
        <section className="list-modal-container">
            <h2 className="add-list-modal-title">My Lists</h2>
            <div className="add-list-btn-container">
                {listNames && (Array.from(listNames).map((listName) => {
                    const isStockInList = listItems
                        .filter(ele => ele.list_name === listName)
                        .map(ele => ele.stock_symbol)
                        .includes(stockSymbol)
                    const listData = {
                        "list_name": 
                            "Testing",
                        "stock_symbol": 
                            "APPL"
                        
                    }
                    return (
                        <button
                            className={`add-to-list-btn ${isStockInList ? "is-added" : "not-added"}`}
                            onClick={() => handleAddList(listData)}
                            disabled={isStockInList}
                            key={listName}
                        >
                            {listName}
                        </button>
                    )
                }))}
                <button
                    className="add-to-list-btn not-added"
                >
                    Create your list
                </button>
            </div>
        </section>
    )
}
