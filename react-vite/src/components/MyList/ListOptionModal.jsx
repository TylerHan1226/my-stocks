import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list";
import AddListModal from "./AddListModal";

export default function ListOptionModal({ stockSymbol, listUpdated, setListUpdated, listToRemove, setAllListUpdated, allListsUpdated }) {
    const { closeModal } = useModal()
    const listName = useParams()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const allListItems = useSelector(state => state.lists?.My_Lists)
    const listId = allListItems.filter(ele => ele.list_name == listName?.listName && ele.stock_symbol == stockSymbol)?.[0]?.id
    const currentListItems = allListItems.filter(ele => ele.list_name == listName?.listName)
    let isLastList = false

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(<AddListModal stockSymbol={stockSymbol} />)
    }
    const handleRemoveFromList = async () => {
        dispatch(removeListThunk(listId))
        alert(`Successfully removed ${stockSymbol} from list "${listName?.listName}"`)
        if (currentListItems.length <= 1) {
            nav('/my_lists')
        }
        setListUpdated(!listUpdated)
        closeModal()
    }
    const listItemsToRemove = allListItems?.filter(ele => ele?.list_name == listToRemove)
    //check if the one to delete is the last list
    if (listItemsToRemove.length == allListItems.length) {
        isLastList = true
    }
    const handleRemoveList = async () => {
        await Promise.all(listItemsToRemove.map(ele => dispatch(removeListThunk(ele.id))));
        alert(`Successfully removed ${listToRemove}`)
        setAllListUpdated(prev => !prev)
        if (isLastList) {
            nav('/')
        }
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
            {currentListItems.length > 0 ? (
                <div className="option-modal-btn-container">
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
                </div>
            ) : (
                <button
                    className="add-to-list-btn not-added list-option-btn"
                    onClick={handleRemoveList}
                >
                    Remove this list
                </button>
            )}

        </section>
    )
}
