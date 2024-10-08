import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import { useModal } from "../../context/Modal";
import { FaSearch } from "react-icons/fa";

export default function Search() {
    const [searchInput, setSearchInput] = useState("")
    const [error, setError] = useState("")
    const nav = useNavigate()
    const { closeModal } = useModal()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchInput.length === 0) {
            setError("Please enter a stock symbol.")
        } else if (!/^[A-Z]+$/.test(searchInput)) {
            setError("Please enter valid stock symbol")
        } else {
            setError("")
            nav(`/search/${searchInput}`)
            window.location.reload()
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
                        placeholder="Find Your Stock by Symbol"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                        autoFocus
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
