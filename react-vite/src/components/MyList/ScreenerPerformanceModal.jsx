
import { useDispatch } from "react-redux"
import { updateListThunk } from "../../redux/list"
import { useModal } from "../../context/Modal"
import { useState } from "react"
import { FiArrowDown, FiArrowUp, FiArrowDownRight, FiArrowRight, FiArrowUpRight } from "react-icons/fi";


export default function ScreenerPerformanceModal({ symbol, listId, currPerformance }) {

    const dispatch = useDispatch()
    const {closeModal} = useModal()
    const performanceRating = [1, 2, 3, 4, 5]

    const handleSetPerformance = (selectedPerformance) => {
        const updatedListData = { "performance_change": selectedPerformance }
        dispatch(updateListThunk(updatedListData, listId))
        closeModal()
        window.location.reload()
    }

    return (
        <section className="screener-modal-container">
            <h2 className="modal-title">Set Performance for {symbol}</h2>
            <div className="screener-modal-btn-container">
            {performanceRating.map((ele, index) => (
                <button
                    key={index}
                    className={`screener-performance-map-btn ${ele != currPerformance ? 'not-added' : 'is-added '}`}
                    onClick={() => handleSetPerformance(ele)}
                    disabled={ele == currPerformance}
                    >
                    <div>
                        {ele == 1 ? <FiArrowUp /> : ele == 2 ? <FiArrowUpRight /> : ele == 3 ? <FiArrowRight /> : ele == 4 ? <FiArrowDownRight /> : <FiArrowDown />}
                    </div>
                </button>
            ))}
            </div>
        </section>
    )
}