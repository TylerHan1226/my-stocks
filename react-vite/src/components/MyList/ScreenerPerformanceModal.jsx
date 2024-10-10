
import { useDispatch } from "react-redux"
import { updateListThunk } from "../../redux/list"
import { useModal } from "../../context/Modal"
import { useState } from "react"

export default function ScreenerPerformanceModal({ symbol, listId, currPerformance }) {

    // const []
    const handleSetPerformance = (selectedPerformance) => {
        console.log('handleSetPerformance clicked!')
        // const updatedListData = { "screener_period": selectedPerformance }
        // dispatch(updateListThunk(updatedListData, listId))
        // closeModal()
        // window.location.reload()
    }

    return (
        <section className="screener-modal-container">
            <h2 className="modal-title">Set Performance for {symbol}</h2>
            <div className="screener-modal-btn-container">
            {/* {existingKeys.map((ele, index) => (
                <button
                    key={index}
                    className={`screener-period-map-btn ${ele != currPerformance ? 'not-added' : 'is-added '}`}
                    onClick={() => handleSetPerformance(ele)}
                    disabled={ele == currPerformance}
                    >
                    {ele?.split('_')[2]}
                </button>
            ))} */}
            </div>
        </section>
    )
}