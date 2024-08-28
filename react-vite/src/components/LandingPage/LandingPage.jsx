
// import ProfileButton from "./ProfileButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllInstrumentsThunk } from '../../redux/instrument'
import { createOrderThunk, getOrderByUserThunk } from "../../redux/cart";
import Loading from "../Loading/Loading";

import "./LandingPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaDice } from "react-icons/fa6";


export const handleAddToCart = (instrumentId, orders, dispatch, nav) => {
  const orderInstIds = orders?.map(ele => ele.instrument_id)
  //check if already added item to the cart
  if (orderInstIds.includes(instrumentId)) {
    alert("This instrument is already in your cart! You can change the quantity in your cart page.")
  } else {
    const newOrder = {
      instrument_id: instrumentId
    }
    dispatch(createOrderThunk(newOrder))
    alert("You've placed the order successfully!")
    nav('/orders/MyOrders')
  }
}


export default function LandingPage() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const instruments = useSelector(state => state.instruments)
  const orders = useSelector(state => state.orders?.CurrentOrders)

  const [randomInstruments, setRandomInstruments] = useState([])

  useEffect(() => {
    dispatch(getAllInstrumentsThunk())
    dispatch(getOrderByUserThunk())
  }, [dispatch])

  useEffect(() => {
    if (instruments && instruments.Instruments) {
      getRandomized()
    }
  }, [instruments])

  if (!instruments) {
    return <Loading />
  }

  const allInstruments = instruments.Instruments
  const allInstIds = allInstruments?.map(ele => ele.id)

  // generate random instrument ids
  function randomIdGenerator(arr, count) {
    const shuffledArr = arr.sort(() => Math.random() - 0.5)
    return shuffledArr.slice(0, count)
  }
  // helper
  function getRandomized() {
    const randomIds = randomIdGenerator(allInstIds, 12)
    const newRandomInstruments = allInstruments?.sort(() => Math.random() - 0.5).filter(ele => randomIds.includes(ele.id))
    setRandomInstruments(newRandomInstruments)
  }
  //randomize button
  const handleRandomizeInstClick = () => {
    getRandomized()
  }

  //add to cart button
  let isDisable = true
  if (user) {
    isDisable = false
  }

  const handleCategory = (category) => {
    nav(`search/${category}`)
  }


  return (
    <div className="page-container">
      <div id="landing-container">
        <div className="landing-header-actions">
          <h1>Category</h1>
          <div className="header-tabs-container">
            <section className="header-category">
              <button className="category-tabs" onClick={() => handleCategory('Electric Guitar')}>
                <img
                  src='https://res.cloudinary.com/do8l6gpqp/image/upload/v1712348805/Riff-Harbor/ESP_e-g_bbjtj0.jpg'
                  alt='Electric Guitar Category'
                  className="category-tab-image"
                />
              </button>
              <h3>Electric Guitars</h3>
            </section>

            <section className="header-category">
              <button className="category-tabs" onClick={() => handleCategory('Acoustic Guitar')}>
                <img
                  src='https://res.cloudinary.com/do8l6gpqp/image/upload/v1712348948/Riff-Harbor/lake_a-g_ouk3gj.jpg'
                  alt='Acoustic Guitar Category'
                  className="category-tab-image"
                />
              </button>
              <h3>Acoustic Guitars</h3>
            </section>

            <section className="header-category">
              <button className="category-tabs" onClick={() => handleCategory('Bass')}>
                <img
                  src='https://res.cloudinary.com/do8l6gpqp/image/upload/v1712348949/Riff-Harbor/ESP_b_ak9opy.jpg'
                  alt='Bass Category'
                  className="category-tab-image"
                />
              </button>
              <h3>Basses</h3>
            </section>

          </div>
        </div>
      </div>

      <div className="landing-header-actions">
        <h1>Gallery</h1>
        <div id='dice-container' >
          <FaDice id='dice-icon' onClick={handleRandomizeInstClick} />
          <p id='dice-text'>click to randomize</p>
        </div>
      </div>

      <div className="landing-instruments-container">
        {randomInstruments.length > 0 && randomInstruments?.map((eachInst) => (
          <section className="instrument-container" key={eachInst?.id}>
            <div className="instrument-dtl-container">
              <NavLink className='landing-page-inst-image-container' to={`instruments/${eachInst?.id}`}>
                <img className="instrument-image" src={eachInst?.image_url} />
              </NavLink>
            </div>
            <div className="instrument-dtl-container">
              <h4 className="black-text instrument-model">{eachInst?.model}</h4>
              <p className="inst-landing-dtl-text">{eachInst?.category}</p>

              {eachInst?.discount < 1 ? (
                <div className="landing-discount-container">
                  <div className="discount-price-container">
                    <p className="inst-landing-dtl-text discount-price">
                      ${eachInst?.price}
                    </p>
                    <p className="inst-landing-dtl-text">
                      ${(eachInst?.price * eachInst?.discount).toFixed(2)}
                    </p>
                  </div>
                  <div className="landing-money-saved">
                    <p >
                    Save ${(eachInst?.price - (eachInst?.price * eachInst?.discount)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="inst-landing-dtl-text">${eachInst?.price}</p>
              )}

              {eachInst?.seller_id == user?.id ? (
                <button className="add-to-cart-button">
                  <NavLink className='add-to-cart-text' to={`instruments/${eachInst?.id}/update`}>
                    Update
                  </NavLink>
                </button>
              ) : (
                <button
                  className={`add-to-cart-button ${user ? '' : 'disabled'}`}
                  onClick={() => handleAddToCart(eachInst.id, orders, dispatch, nav)}
                  disabled={isDisable}
                >
                  <NavLink className='add-to-cart-text'>
                    Add to Cart
                  </NavLink>
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
