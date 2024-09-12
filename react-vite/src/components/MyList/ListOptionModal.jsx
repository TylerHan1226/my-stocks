import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list";


export default function ListOptionModal({ listNameSelected }) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)

    const [isEditing, setIsEditing] = useState(false)
    const [newListName, setNewListName] = useState(listNameSelected)

    // Handle Remove List
    const handleRemoveList = async () => {
        const response = await dispatch(removeListThunk(listNameSelected))
        if (response) window.location.reload()
        closeModal()
        nav('/my_lists')
    }

    // Edit List Name
    const handleEditName = async () => {
        console.log("Edit Name Button!")
        setIsEditing(true)
    }
    const handleNameChange = (e) => {
        setNewListName(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(`edit ${listNameSelected}`)
        // const res = await dispatch()
        if (res) {
            setIsEditing(false)
            window.location.reload()
        }
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
                {isEditing ? (
                    <form className="edit-listName-form" onSubmit={handleSubmit}>
                        <input
                            className="add-list-input-field"
                            type='text'
                            value={newListName}
                            onChange={handleNameChange}
                            autoFocus
                        />
                        <button className="edit-listName-btn" type='submit'>
                            Submit
                        </button>
                    </form>
                    
                ) : (
                    <button
                    className="add-to-list-btn not-added"
                    onClick={handleEditName}
                >
                    Edit name
                </button>
                )}
                <button
                    className="add-to-list-btn red-border delete-red-text"
                    onClick={handleRemoveList}
                >
                    Remove list {listNameSelected}
                </button>
                {/* <button className="add-to-list-btn not-added"
                    onClick={closeModal}>
                    Cancel
                </button> */}
            </div>
        </section>
    )
}
