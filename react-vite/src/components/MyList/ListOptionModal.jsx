import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list";


export default function ListOptionModal({
    reRenderOnUpdate,
    listToRemove,
}) {

    const { closeModal } = useModal()
 
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)


    const handleRemoveList = async () => {
        console.log("handleRemoveList clicked!")
        console.log('listToRemove ==>', listToRemove)
        dispatch(removeListThunk(listToRemove))
        alert(`Successfully removed list: ${listToRemove}`)
        reRenderOnUpdate()
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
                    className="add-to-list-btn list-option-btn red-border delete-red-text"
                    onClick={handleRemoveList}
                >
                    Remove list: {listToRemove}
                </button>
            </div>
        </section>
    )
}
