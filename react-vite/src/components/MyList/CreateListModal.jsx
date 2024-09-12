import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { addListThunk, getAllMyListsThunk } from "../../redux/list";

export default function CreateListModal({ stockSymbol }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const listItems = useSelector(state => state.lists?.My_Lists)

    const [newListName, setNewListName] = useState('')
    const [newListStockSyb, setNewListStockSyb] = useState('')
    const [validations, setValidations] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    const listNames = new Set()
    listItems?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    const validateForm = () => {
        const validationErrors = {}
        if (!newListName || newListName.length > 20) {
            validationErrors.newListName = 'Please enter a list name between 1 and 20 characters'
        } else if (listNames.has(newListName)) {
            validationErrors.newListName = 'A list with this name already exists'
        }
        return validationErrors
    }

    useEffect(() => {
        if (!user) {
            return nav('/')
        }
        if (isSubmitted) {
            setValidations(validateForm())
        }
    }, [newListName, user, isSubmitted])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitted(true)
        const currentValidations = validateForm()
        setValidations(currentValidations)
        if (Object.keys(currentValidations).length > 0) {
            return
        }
        let newListData = {}
        if (stockSymbol?.length > 0) {
            newListData = { "list_name": newListName, "stock_symbol": stockSymbol }
        } else {
            newListData = { "list_name": newListName, "stock_symbol": newListStockSyb }
        }
        try {
            const response = await dispatch(addListThunk(newListData))
            setTimeout(() => {
                window.location.reload()
                closeModal()
                nav(`/my_lists`)
                // if (newListStockSyb && newListName) {
                //     nav(`/my_lists/${newListName}`)
                // } else {
                //     nav(`/my_lists`)
                // }
            }, 0.5)
        } catch (error) {
            setValidations(prevValidations => ({
                ...prevValidations,
                newListStockSyb: "Invalid Stock Symbol"
            }))
        }
    }

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch])

    return (
        <section className="list-modal-container">
            <h2 className="add-list-modal-title">{stockSymbol ? `Create a new list for ${stockSymbol}!` : 'Create a new list!'}</h2>
            <form className="add-list-form" onSubmit={handleSubmit}>
                <label className="add-list-label">
                    <input
                        className="add-list-input-field"
                        type="text"
                        name="newListName"
                        value={newListName}
                        placeholder="New List Name"
                        onChange={e => setNewListName(e.target.value)}
                    />
                </label>
                {validations.newListName &&
                    <p className="validation-error-text">* {validations.newListName}</p>}
                {!stockSymbol &&
                    <label className="add-list-label">
                        <input
                            className="add-list-input-field"
                            type="text"
                            name="newListStockSyb"
                            value={newListStockSyb}
                            placeholder="Stock Symbol"
                            onChange={e => setNewListStockSyb(e.target.value)}
                        />
                    </label>}
                {validations.newListStockSyb &&
                    <p className="validation-error-text">* {validations.newListStockSyb}</p>}
                <button className="add-to-list-btn not-added" type='submit'>
                    Create My List
                </button>
                {/* <button className="add-to-list-btn not-added"
                    onClick={closeModal}>
                    Cancel
                </button> */}
            </form>
        </section>
    )
}