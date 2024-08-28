import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { getOrderByUserThunk } from "../../redux/cart";
import { getInstrumentsByIdsThunk } from "../../redux/instrument";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import OrderOperation from './OrderOperation'
import ClearCart from './ClearCart';
import History from './History';
import Checkout from './Checkout';
import './Orders.css'
import Loading from '../Loading/Loading';
import { getSubtotal } from './OrderHelper';


export default function MyOrders() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const orders = useSelector(state => state.orders?.CurrentOrders)
    const instruments = useSelector(state => state.instruments)
    const instArr = Object.values(instruments)?.slice(0, orders?.length)
    const instrumentIds = orders?.map(ele => ele.instrument_id)

    const [hasDeleted, setDeleted] = useState(false)
    const reRenderOnDelete = () => {
        setDeleted(!hasDeleted)
    }

    const subtotal = getSubtotal(instArr, orders)

    useEffect(() => {
        if (!user) {
            nav('/')
        }
        dispatch(getOrderByUserThunk());
    }, [dispatch, user, hasDeleted, subtotal])

    useEffect(() => {
        if (instrumentIds?.length > 0 && orders) {
            dispatch(getInstrumentsByIdsThunk(instrumentIds));
        }
    }, [dispatch, orders, hasDeleted])

    if (!orders || !instruments) {
        return <Loading />
    }

    return (
        <div className="cart-page-container">

            <div className="my-cart-item-container">
                {instArr?.length > 0 ? (instArr?.map((eachInst) => (
                    <div className="cart-instrument-container" key={eachInst?.id}>
                        <div className="instrument-dtl-container">
                            <NavLink to={`/instruments/${eachInst?.id}`}>
                                <img className="instrument-image" src={eachInst?.image_url} />
                            </NavLink>
                        </div>
                        <div className="instrument-dtl-container">
                            <h4 className="black-text">{eachInst?.model}</h4>
                            <p className="black-text">{eachInst?.category}</p>
                            {eachInst?.discount < 1 ? (
                <div className="landing-discount-container">
                  <div className="discount-price-container">
                    <p className="instrument-card-dtl-text discount-price">
                      ${eachInst?.price}
                    </p>
                    <p className="instrument-card-dtl-text">
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
                <p className="instrument-card-dtl-text">${eachInst?.price}</p>
              )}
                            {eachInst?.is_used ? (
                                <p className="black-text">Pre-owned</p>
                            ) : (
                                <p className="black-text">New</p>
                            )}
                        </div>
                        <OrderOperation
                            orderInfo={orders.filter(ele => ele.instrument_id == eachInst.id)[0]}
                            reRenderOnDelete={reRenderOnDelete}
                        />
                    </div>
                ))) : (
                    <h2>Your Cart is empty</h2>
                )}
            </div>
            
            <div className='cart-checkout-container'>
                <h1>My Orders</h1>
                <h3>Subtotal: ${subtotal}</h3>
                <button className="order-action-button">
                    <OpenModalMenuItem
                        itemText="Clear Cart"
                        modalComponent={<ClearCart />}
                    />
                </button>
                <button className="order-action-button">
                    <OpenModalMenuItem
                        itemText="Order History"
                        modalComponent={<History />}
                    />
                </button>
                <button className="order-action-button">
                    <OpenModalMenuItem
                        itemText="Checkout"
                        modalComponent={<Checkout />}
                    />
                </button>
            </div>
        </div>

    )
}