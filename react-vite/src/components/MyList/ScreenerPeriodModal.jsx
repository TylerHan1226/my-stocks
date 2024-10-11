import { useDispatch } from "react-redux"
import { updateListThunk } from "../../redux/list"
import { useModal } from "../../context/Modal"

export default function ScreenerPeriodModal({ symbol, currentPeriod, listId, stock}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal()
    const stockPeriods = ['historical_data_6mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr']
    const existingKeys = stockPeriods.filter(key => key in stock && stock[key]?.length > 0);

    const handleSetPeriod = (selectedPeriod) => {
        const updatedListData = { "screener_period": selectedPeriod }
        dispatch(updateListThunk(updatedListData, listId))
        closeModal()
        window.location.reload()
    }

    return (
        <section className="screener-modal-container">
            <h2 className="modal-title">Set Period for {symbol}</h2>
            <div className="screener-modal-btn-container">
            {existingKeys.map((ele, index) => (
                <button
                    key={index}
                    className={`screener-period-map-btn ${ele != currentPeriod ? 'not-added' : 'is-added '}`}
                    onClick={() => handleSetPeriod(ele)}
                    disabled={ele == currentPeriod}
                    >
                    {ele?.split('_')[2]}
                </button>
            ))}
            </div>
        </section>
    )
}