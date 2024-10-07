import { useDispatch } from "react-redux"
import { updateListThunk } from "../../redux/list"
import { useModal } from "../../context/Modal"



export default function ScreenerHistDivModal({symbol, listId}) {
    // const dispatch = useDispatch()
    // const {closeModal} = useModal()
    console.log('symbol ==>', symbol)
    console.log('listId ==>', listId)

    // const handleSetPeriod = (selectedPeriod) => {
    //     console.log('selectedPeriod ==>', selectedPeriod)
    //     const updatedListData = { "screener_period": selectedPeriod }
    //     console.log('updatedListData ==>', updatedListData)
    //     dispatch(updateListThunk(updatedListData, listId))
    //     closeModal()
    //     window.location.reload()
    // }

    return (
        <section className="screener-modal-container">
            <h2 className="modal-title">Set {symbol} Historical Dividend</h2>
            <div className="screener-modal-btn-container">
            {/* {['historical_data_6mo', 'historical_data_1yr', 'historical_data_5yr', 'historical_data_10yr'].map((ele, index) => (
                <button
                    key={index}
                    className={`screener-period-map-btn ${ele != currentPeriod ? 'not-added' : 'is-added '}`}
                    onClick={() => handleSetPeriod(ele)}
                    disabled={ele == currentPeriod}
                    >
                    {ele?.split('_')[2]}
                </button>
            ))} */}
            </div>
        </section>
    )
}