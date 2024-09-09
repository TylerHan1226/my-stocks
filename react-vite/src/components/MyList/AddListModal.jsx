import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { FaHandPointLeft, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { addListThunk, getAllMyListsThunk } from "../../redux/list";
import CreateListModal from "./CreateListModal";

export default function AddListModal({stockSymbol}) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const listItems = useSelector(state => state.lists?.My_Lists)

    const listNames = new Set()
    listItems?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(<CreateListModal stockSymbol={stockSymbol} />)
    }

    const handleAddList = (listData) => {
        // console.log("listData ==>", listData)
        dispatch(addListThunk(listData))
        alert("Added to list successfully!")
        closeModal()
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
                            listName,
                        "stock_symbol": 
                            stockSymbol
                    }
                    return (
                        <button
                            className={`add-to-list-btn${isStockInList ? "is-added" : "not-added"}`}
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
                    onClick={handleOpenModal}
                >
                    Create your list
                </button>
            </div>
        </section>
    )
}
