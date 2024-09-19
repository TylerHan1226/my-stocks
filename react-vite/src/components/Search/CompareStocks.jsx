import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import { useModal } from "../../context/Modal";
import { FaSearch } from "react-icons/fa";

export default function CompareStocks({setStockToCompare}) {
    const [stockToSearch, setStockToSearch] = useState("")
    const [error, setError] = useState("")
    const nav = useNavigate()
    const { closeModal } = useModal()

    const handleSearch = (e) => {
        e.preventDefault()
        if (stockToSearch.length === 0) {
            setError("Please enter a stock symbol.")
        } else if (!/^[A-Z]+$/.test(stockToSearch)) {
            setError("Please enter valid stock symbol")
        } else {
            setError("")
            // nav(`/search/${stockToSearch}`)
            // window.location.reload()
            setStockToCompare(stockToSearch)
            console.log('stockToSearch ==>', stockToSearch)
            closeModal()
        }
    };

    return (
        <section className="search-modal-container">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-form-fields">
                    <input
                        className="search-form-field-input"
                        type="text"
                        placeholder="Add Stock to Compare"
                        value={stockToSearch}
                        onChange={(e) => setStockToSearch(e.target.value.toUpperCase())}
                    />
                    <button className="search-modal-btn" type="submit">
                        <p className="search-modal-btn-text"><FaSearch /></p>
                    </button>
                </div>
                {error && <p className="validation-error-text">* {error}</p>}
            </form>
        </section>
    );
}
