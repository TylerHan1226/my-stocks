import { useDispatch } from "react-redux"
import { updateListThunk } from "../../redux/list"
import { useModal } from "../../context/Modal"
import { useState } from "react"



export default function ScreenerHistDivModal({ symbol, listId, currHistDiv }) {
    const dispatch = useDispatch()
    // const {closeModal} = useModal()
    console.log('symbol ==>', symbol)
    console.log('listId ==>', listId)
    console.log('currHistDiv ==>', currHistDiv)

    const [newHistDiv, setNewHistDiv] = useState(currHistDiv)
    const [validations, setValidations] = useState({})

    const validateForm = () => {
        const validationErrors = {}
        if (isNaN(newHistDiv)) {
            validationErrors.newHistDiv = 'Please enter valid historical dividend'
        }
        return validationErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const currValidations = validateForm()
        setValidations(currValidations)
        if (Object.keys(currValidations).length > 0) return
        const histDivData = { "historical_dividend": parseFloat(newHistDiv) }
        dispatch(updateListThunk(histDivData, listId))
        window.location.reload()
    }

    return (
        <section className="screener-modal-container">
            <h2 className="modal-title">Set {symbol} Historical Dividend</h2>
            <div className="screener-form-container">
                <h2 className="input-dollar-sign">$</h2>
                <form className="edit-listName-form" onSubmit={handleSubmit}>
                    <label className="add-list-label">
                        <input
                            className="add-list-input-field"
                            type="text"
                            name="screener-historical-dividend"
                            value={isNaN(newHistDiv) ? '' : newHistDiv}
                            onChange={e => setNewHistDiv(e.target.value)}
                            autoFocus
                        />
                        <button className="edit-listName-btn" type='submit'>
                            Submit
                        </button>
                    </label>
                    {validations.newHistDiv &&
                        <p className="validation-error-text">* {validations.newHistDiv}</p>}
                </form>
            </div>
        </section>
    )
}