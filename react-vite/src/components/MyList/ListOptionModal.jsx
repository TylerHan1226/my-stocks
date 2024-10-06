import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import "./Modal.css";
import { getAllMyListsThunk, removeListThunk, updateListNamesThunk } from "../../redux/list";

export default function ListOptionModal({ listNameSelected }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const listItems = useSelector(state => state.lists?.My_Lists)

    const [isEditing, setIsEditing] = useState(false)
    const [newListName, setNewListName] = useState(listNameSelected)
    const [validations, setValidations] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    const listNames = new Set()
    listItems?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    // Handle Remove List
    const handleRemoveList = async () => {
        const response = await dispatch(removeListThunk(listNameSelected))
        if (response) window.location.reload()
        closeModal()
        nav('/my_lists')
    };

    // Edit List Name
    const handleEditName = async () => {
        setIsEditing(true)
    }
    console.log('listItems ==>', listItems)
    const validateForm = () => {
        const validationErrors = {}
        if (listNames?.has(newListName)) {
            validationErrors.newListName = 'A list with this name already exists'
        }
        return validationErrors
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitted(true)
        const currentValidations = validateForm()
        setValidations(currentValidations)
        console.log('currentValidations ==>', currentValidations)
        if (Object.keys(currentValidations).length > 0) return

        const updatedListNameData = { "list_name": newListName }
        console.log('newListName ==>', newListName)
        console.log('listNameSelected ==>', listNameSelected)
        console.log('updatedListNameData ==>', updatedListNameData)

        const res = await dispatch(updateListNamesThunk(updatedListNameData, listNameSelected))
        if (res) {
            setIsEditing(false)
            window.location.reload()
            closeModal()
            nav(`/my_lists`)
        }
    }

    useEffect(() => {
        if (!user) {
            return nav('/')
        }
        dispatch(getAllMyListsThunk())
        if (isSubmitted) {
            setValidations(validateForm())
        }
    }, [dispatch, nav, user, newListName, isSubmitted, setValidations])

    return (
        <section className="list-modal-container">
            <h2 className="modal-title">Options</h2>
            <div className="option-modal-btn-container">
                {isEditing ? (
                    <form className="edit-listName-form" onSubmit={handleSubmit}>
                        <label className="add-list-label">
                            <input
                                className="add-list-input-field"
                                type='text'
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                                autoFocus
                            />
                            <button className="edit-listName-btn" type='submit'>
                                Submit
                            </button>
                        </label>
                        {validations.newListName &&
                            <p className="validation-error-text">* {validations.newListName}</p>}
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
            </div>
        </section>
    );
}
