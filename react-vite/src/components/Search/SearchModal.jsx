import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Search.css";
import { useModal } from "../../context/Modal";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdSailing } from "react-icons/md";

export default function Search() {
    const [searchInput, setSearchInput] = useState("")
    const nav = useNavigate()
    const { closeModal } = useModal()

    const instruments = useSelector(state => state.instruments?.Instruments)

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchInput.length == 0) {
            nav(`/`)
        } else {
            nav(`/search/${searchInput}`)
        }
        closeModal()
    };

    const handleTrendingBtn = (trendingText) => {
        nav(`/search/${trendingText}`)
        closeModal()
    }

    // add customized trending instruments (can be dynamic with more instruments attributes in the future)
    const trendingInstruments = instruments?.filter(ele => [5, 7, 33, 39].includes(ele.id))

    // filter instruments with discount
    let discountInstruments = instruments?.filter(ele => ele.discount < 1)
    //randomize helper
    function shuffleArray(array) {
        for (let i = array?.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    discountInstruments = shuffleArray(discountInstruments)?.slice(0, 5)
    console.log(discountInstruments)

    return (
        <section id="search-modal-container">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-form-fields">
                    <input
                        className="search-form-field-input"
                        type="text"
                        placeholder="Find your sound"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button className="search-modal-btn" type="submit">
                        <p className="search-modal-btn-text"><FaSearch /></p>
                    </button>
                </div>
            </form>
            <section>
                <section className="search-trending-container">
                    <div className="search-trending-search-container">
                        <h3>Trending Search</h3>
                        <div className="search-trending-searches">
                            <button className="search-trending-btns"
                                onClick={() => handleTrendingBtn("Fender")}>
                                Fender
                            </button>
                            <button className="search-trending-btns"
                                onClick={() => handleTrendingBtn("Les Paul")}>
                                Les Paul
                            </button>
                            <button className="search-trending-btns"
                                onClick={() => handleTrendingBtn("Vintage")}>
                                Vintage
                            </button>
                            <button className="search-trending-btns"
                                onClick={() => handleTrendingBtn("Taylor")}>
                                Taylor
                            </button>
                            <button className="search-trending-btns"
                                onClick={() => handleTrendingBtn("Acoustic Guitar")}>
                                Acoustic Guitar
                            </button>
                            <button className="search-trending-btns"
                                onClick={() => handleTrendingBtn("Black Satin")}>
                                Black Satin
                            </button>
                        </div>
                    </div>
                    <div className="search-trending-products-container">
                        <h3>Trending Products</h3>
                        <div className="trending-products-container">
                            {trendingInstruments?.length > 0 && (
                                trendingInstruments.map((eachInst) => (
                                    <div className="trending-product" key={eachInst.id}>
                                        <NavLink to={`instruments/${eachInst.id}`} onClick={closeModal}>
                                            <img className="trending-products-img" src={eachInst.image_url} />
                                        </NavLink>
                                        <p className="trending-product-text">{eachInst.model}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <div className="search-trending-products-container">
                        <h3>Limited Discount!</h3>
                        <div className="trending-products-container">
                            {discountInstruments?.length > 0 && (
                                discountInstruments.map((eachInst) => (
                                    <div className="trending-product" key={eachInst.id}>
                                        <NavLink to={`instruments/${eachInst.id}`} onClick={closeModal}>
                                            <img className="trending-products-img" src={eachInst.image_url} />
                                        </NavLink>
                                        <p className="trending-product-text">{eachInst.model}</p>
                                        <div className="search-modal-discount-container">
                                            <p className="search-modal-discount-text">{((1 - eachInst.discount) * 10).toFixed(0) * 10}% OFF!</p>
                                            <p className="search-modal-discount-text"><MdSailing /></p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                </div>

            </section>
        </section>
    );
}
