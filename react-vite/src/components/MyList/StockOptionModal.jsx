import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { getAllMyListsThunk, removeStockThunk } from "../../redux/list";
import AddListModal from "./AddListModal";

export default function StockOptionModal({ stockSymbol }) {

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
    const handleRemoveFromList = async () => {
        dispatch(removeStockThunk(listId))
        alert(`Successfully removed ${stockSymbol} from list "${listName?.listName}"`)
        if (currentListItems.length <= 1) {
            nav('/my_lists')
        }
        window.location.reload()
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
            <h2 className="add-list-modal-title">Options</h2>
            <div className="option-modal-btn-container">
                <button
                    className="add-to-list-btn not-added"
                    onClick={handleOpenModal}
                >
                    Add {stockSymbol} to other lists
                </button>
                <button
                    className="add-to-list-btn red-border delete-red-text"
                    onClick={handleRemoveFromList}
                >
                    Remove {stockSymbol} from this list
                </button>
            </div>
        </section>
    )
}
