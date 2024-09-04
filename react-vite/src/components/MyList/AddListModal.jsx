import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { FaHandPointLeft, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { getAllMyListsThunk } from "../../redux/list";

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

    const handle = (e) => {
        console.log("HANDLE!!!")
        closeModal()
    };

    console.log("listItems ==>", listItems)
    console.log("listNames ==>", listNames)
    const test = Array.from(listNames).map((listName) => (
        listItems.filter(ele => ele.list_name == listName).map(ele => ele.stock_symbol)
    ))
    console.log("test ==>", test)

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch])

    if (!user) {
        return nav('/')
    }

    return (
        <section className="search-modal-container">
            {Array.from(listNames).map((listName) => (
                <button
                className={`add-to-list-btn
                ${listItems.filter(ele => ele.list_name == listName).map(ele => ele.stock_symbol).includes(stockSymbol)
                    ? "is-red" : "false"}
                `}
                onClick={() => handle()}
                key={listName}>
                    {listName}
                </button>
            ))}
        </section>
    );
}