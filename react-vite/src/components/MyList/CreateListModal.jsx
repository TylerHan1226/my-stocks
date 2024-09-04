import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { FaHandPointLeft, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addListThunk, getAllMyListsThunk } from "../../redux/list";

export default function CreateListModal({stockSymbol}) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const listItems = useSelector(state => state.lists?.My_Lists)

    const listNames = new Set()
    listItems?.forEach(ele => {
        listNames.add(ele.list_name)
    })


    // const handleAddList = (listData) => {
    //     console.log("listData ==>", listData)
    //     dispatch(addListThunk(listData))
    //     alert("Added to list successfully!")
    //     closeModal()
    // };

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch])

    if (!user) {
        return nav('/')
    }

    return (
        <section className="list-modal-container">
            <h2 className="add-list-modal-title">Create list for {stockSymbol}!</h2>
        </section>
    )
}
