import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { getInstrumentBySearchThunk } from "../../redux/instrument";
import { addToFavoriteThunk, getUserFavThunk, removeFavThunk } from "../../redux/favorite";
import { InstrumentCard } from "../Instrument/InstrumentHelpers";
import { FilterCard } from "./FilterCard";
import { handleAddToCart } from "../LandingPage/LandingPage";
import { getOrderByUserThunk } from "../../redux/cart";
import Loading from "../Loading/Loading";


export default function SearchPage() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { searchInput } = useParams()
    const user = useSelector(state => state.session.user)
    // let instruments = useSelector(state => state.instruments?.SelectedInstruments)
    const favorites = useSelector(state => state.favorites?.MyFavorites)
    const favoriteInstIds = favorites?.map(ele => ele.instrument_id)
    const orders = useSelector(state => state.orders?.CurrentOrders)

    const [toFav, setToFav] = useState(false)
    const [removeFav, setRemoveFav] = useState(false)
    let [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        dispatch(getInstrumentBySearchThunk(searchInput)).then((results) => {
            setSearchResults(results?.SelectedInstruments)
        })
        dispatch(getUserFavThunk())
        dispatch(getOrderByUserThunk())
        setToFav(false)
        setRemoveFav(false)
    }, [nav, dispatch, searchInput, toFav, removeFav])

    const isDisable = user ? false : true

    // Filters
    // brand filter
    const [brand, setBrand] = useState('')
    const handleBrandChange = (e) => {
        setBrand(e)
    }
    if (brand !== '') searchResults = searchResults?.filter(ele => ele.make == brand)
    // condition filter
    const [isUsed, setIsUsed] = useState(null)
    const handleCondition = (e) => {
        if ((isUsed == true && e == true) || (isUsed == false && e == false)) {
            setIsUsed(null)
        } else {
            setIsUsed(e)
        }
    }
    if (isUsed == true) searchResults = searchResults?.filter(ele => ele.is_used == true)
    if (isUsed == false) searchResults = searchResults?.filter(ele => ele.is_used == false)
    // price filter
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const handleMinPriceChange = (e) => {
        const newValue = parseFloat(e.target.value)
        newValue ? setMinPrice(newValue) : setMinPrice('')
    }
    const handleMaxPriceChange = (e) => {
        const newValue = parseFloat(e.target.value)
        newValue ? setMaxPrice(newValue) : setMaxPrice('')
    }
    if (minPrice) searchResults = searchResults?.filter(ele => ele.price > minPrice)
    if (maxPrice) searchResults = searchResults?.filter(ele => ele.price < maxPrice)

    const handleFav = (instrumentId, instrument, favoriteInstIds) => {
        if (favoriteInstIds.includes(instrumentId)) {
            const favToRemove = favorites.filter(fav => fav.instrument_id == instrumentId)[0]
            dispatch(removeFavThunk(favToRemove.id))
            alert(`Removed ${instrument.model} from favorites`)
            setToFav(true)
        } else {
            const newFav = { "instrument_id": instrumentId }
            dispatch(addToFavoriteThunk(newFav))
            alert(`Successfully added ${instrument.model} to favorites!`)
            setRemoveFav(true)
        }
    }
    // discount filter
    const [discountFilter, setDiscountFilter] = useState(false)
    const handleDiscountFilter = (e) => {
        if ((discountFilter == true && e == true) || (discountFilter == false && e == false)) {
            setDiscountFilter(null)
        } else {
            setDiscountFilter(e)
        }
    }
    if (discountFilter == true) searchResults = searchResults?.filter(ele => ele.discount < 1).sort((a, b) => a.discount - b.discount)
    
    if (!searchInput) return <Loading />

    return (
        <div className="page-container">
            <h1>{searchInput}</h1>
            <div className="search-container">
                <FilterCard
                    isUsed={isUsed}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    discountFilter={discountFilter}
                    handleDiscountFilter={handleDiscountFilter}
                    handleBrandChange={handleBrandChange}
                    handleMinPriceChange={handleMinPriceChange}
                    handleMaxPriceChange={handleMaxPriceChange}
                    handleCondition={handleCondition}
                />
                <section className="search-instrument-container">
                    {searchResults?.length > 0 ? (
                        searchResults?.map((eachInst) => (
                            <InstrumentCard key={eachInst?.id}
                                eachInst={eachInst}
                                favoriteInstIds={favoriteInstIds}
                                user={user}
                                orders={orders}
                                isDisable={isDisable}
                                handleFav={() => handleFav(eachInst?.id, eachInst, favoriteInstIds)}
                                handleAddToCart={() => handleAddToCart(eachInst?.id, orders, dispatch, nav)}
                                dispatch={dispatch}
                                nav={nav}
                            />
                        ))
                    ) : (
                        <h3>Sorry, we could not find a match for this search</h3>
                    )}
                </section>
            </div>
        </div>

    );
}
