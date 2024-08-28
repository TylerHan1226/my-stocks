
import { useEffect, useState } from 'react'
import './Instrument.css'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { getOneInstrumentThunk } from '../../redux/instrument'
import { getAllUsersThunk } from '../../redux/session'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import DeleteInstrument from './DeleteInstrument'
import { createOrderThunk, getOrderByUserThunk } from '../../redux/cart'
import { GoHeartFill } from "react-icons/go";
import { getUserFavThunk, removeFavThunk, addToFavoriteThunk } from '../../redux/favorite'


export default function InstrumentDetails() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const instrument = useSelector(state => state.instruments)
    const session = useSelector(state => state.session)
    const user = useSelector(state => state.session.user)
    const userOrders = useSelector(state => state.orders?.CurrentOrders)
    const favorites = useSelector(state => state.favorites?.MyFavorites)

    const [deletedInstrument, setDeleteInst] = useState(false)
    const [toFav, setToFav] = useState(false)
    const [removeFav, setRemoveFav] = useState(false)
    const { instrumentId } = useParams()

    const reRenderOnDelete = () => {
        setDeleteInst(!deletedInstrument)
    }

    useEffect(() => {
        dispatch(getOneInstrumentThunk(instrumentId))
        dispatch(getAllUsersThunk())
        dispatch(getOrderByUserThunk())
        dispatch(getUserFavThunk())
        setToFav(false)
        setRemoveFav(false)
    }, [dispatch, instrumentId, deletedInstrument, user, toFav, removeFav])

    if (!instrument || !instrumentId || !session) {
        return <h2>loading...</h2>
    }

    const allUsers = session.users
    const seller = allUsers?.filter(ele => ele.id == instrument.seller_id)[0]

    // add to cart button
    let isDisable = true
    if (user) {
        isDisable = false
    }
    const handleAddToCart = (instId) => {
        const orderInstIds = userOrders.map(ele => ele.instrument_id)
        //check if already added item to the cart
        if (orderInstIds.includes(instId)) {
            alert("This instrument is already in your cart! You can change the quantity in your cart page.")
        } else {
            const newOrder = {
                instrument_id: instId
            }
            dispatch(createOrderThunk(newOrder))
            alert("You've placed the order successfully!")
            nav('/orders/MyOrders')
        }
    }

    // handle favorite
    const favoriteInstIds = favorites?.map(ele => ele.instrument_id)
    const handleFav = (instrumentId) => {
      if (favoriteInstIds.includes(instrumentId)) {
        const favToRemove = favorites.filter(fav => fav.instrument_id == instrumentId)[0]
        dispatch(removeFavThunk(favToRemove.id))
        alert(`Removed ${instrument.model} from favorites`)
        setToFav(true)
      } else {
        const newFav = {"instrument_id": instrumentId}
        dispatch(addToFavoriteThunk(newFav))
        alert(`Successfully added ${instrument.model} to favorites!`)
        setRemoveFav(true)
      }
    }

    return (
        <section id='instrument-dtl-page-root'>
            <div className='instrument-dtl-page-container'>
                <div className="instrument-dtl-info-container">
                    <button className={`dtl-fav-btn ${favoriteInstIds?.includes(instrument?.id) ? 'favorite' : ''}`}
                        onClick={() => handleFav(instrument?.id)}
                    >
                        <GoHeartFill className={`dtl-fav-icon ${favoriteInstIds?.includes(instrument?.id) ? 'favorite' : ''}`} />
                    </button>
                    <img id="instrument-dtl-image" src={instrument.image_url} />
                </div>
                <div className="instrument-dtl-info-container">
                    <h1>{instrument.model}</h1>
                    <h2 className='black-text'>{instrument.color}</h2>
                    {instrument.discount < 1 ? (
                        <div className='discount-price-container'>
                            <p className="black-text-bold discount-price detail-price-text">
                                ${instrument.price}
                            </p>
                            <p className="black-text-bold detail-price-text">
                                ${(instrument.price * instrument.discount).toFixed(2)}
                            </p>
                            <p className="black-text-bold detail-price-text money-saved">
                                SAVE ${(instrument.price - (instrument.price * instrument.discount)).toFixed(2)} !
                            </p>
                        </div>
                    ) : (
                        <p className="black-text-bold detail-price-text">${instrument.price}</p>
                    )}
                    {instrument.is_used ? (
                        <p className="black-text-bold">Condition: Pre-owned</p>
                    ) : (
                        <p className="black-text-bold">Condition: New</p>
                    )}
                    <p className="black-text-bold">Make: {instrument.make}</p>
                    <p className="black-text-bold">Details: {instrument.details}</p>
                    <p className="black-text-bold">Body Material: {instrument.body}</p>
                    <p className="black-text-bold">Fretboard Material: {instrument.fretboard}</p>
                    <p className="black-text-bold">Seller: {seller?.username}</p>
                    {instrument.seller_id == user?.id ? (
                        <>
                            <button className="add-to-cart-button-dtl">
                                <NavLink className='add-to-cart-text-dtl' to={`update`}>
                                    Update
                                </NavLink>
                            </button>
                            <button className="add-to-cart-button-dtl delete-button">
                                <OpenModalMenuItem
                                    itemText='Delete Instrument'
                                    modalComponent={<DeleteInstrument instrumentId={instrumentId} reRenderOnDelete={reRenderOnDelete} />}
                                />
                            </button>
                        </>
                    ) : (
                        <button
                            className={`add-to-cart-button-dtl ${user ? '' : 'disabled'}`}
                            onClick={() => handleAddToCart(instrument.id)}
                            disabled={isDisable}
                        >
                            <NavLink className='add-to-cart-text-dtl'>
                                Add to Cart
                            </NavLink>
                        </button>
                    )}
                </div>
            </div>
        </section>

    )
}