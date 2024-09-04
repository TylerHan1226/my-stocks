import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list";
import AddListModal from "./AddListModal";

export default function ListOptionModal({stockSymbol, listUpdated, setListUpdated}) {
    const { closeModal } = useModal()
    const listName = useParams()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const allListItems = useSelector(state => state.lists?.My_Lists)
    const listId = allListItems.filter(ele => ele.list_name == listName?.listName && ele.stock_symbol == stockSymbol)?.[0]?.id
    const currentListItems = allListItems.filter(ele => ele.list_name == listName?.listName)
    

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(<AddListModal stockSymbol={stockSymbol} />)
    }
    const handleRemoveFromList = () => {
        console.log("listId ==>", listId)
        dispatch(removeListThunk(listId))
        alert(`Successfully removed ${stockSymbol} from list "${listName?.listName}"`)
        if (currentListItems.length <= 1) {
            nav('/my_lists')
        }
        setListUpdated(!listUpdated)
        closeModal()
    }

    console.log('allListItems ==>', allListItems)
    console.log('currentListItems ==>', currentListItems)

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch])

    if (!user) {
        return nav('/')
    }

    return (
        <section className="list-modal-container">
            <h2 className="add-list-modal-title">Options</h2>
            <button
            className="add-to-list-btn not-added list-option-btn"
            onClick={handleRemoveFromList}
            >
                Remove from this list
            </button>
            <button
            className="add-to-list-btn not-added list-option-btn"
            onClick={handleOpenModal}
            >
                Add to other lists
            </button>
        </section>
    )
}
