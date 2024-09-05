import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { FaHandPointLeft, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addListThunk, getAllMyListsThunk } from "../../redux/list";

export default function CreateListModal({ stockSymbol }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const listItems = useSelector(state => state.lists?.My_Lists)

    const [newListName, setNewListName] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const listNames = new Set()
    listItems?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    console.log("listNames ==>", listNames)
    console.log("stockSymbol ==>", stockSymbol)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true)
        // if (Object.keys(validations).length > 0) {
        //     return
        // }
        const newListData = { "list_name": newListName, "stock_symbol": stockSymbol }
        const newList = await dispatch(addListThunk(newListData))
        nav(`/my_lists`)
        closeModal()
    }

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch])

    if (!user) {
        return nav('/')
    }

    return (
        <section className="list-modal-container">
            <h2 className="add-list-modal-title">Create a new list for {stockSymbol}!</h2>
            <form className="add-list-form"
                onSubmit={handleSubmit}
            >
                <label className="add-list-label">
                    <input
                        className="add-list-input-field"
                        type="text"
                        name="newListName"
                        value={newListName}
                        placeholder="My New List Name"
                        onChange={e => setNewListName(e.target.value)}
                    ></input>
                </label>
                <button className="add-to-list-btn not-added">
                    Create My List
                </button>
            </form>
        </section>
    )
}
