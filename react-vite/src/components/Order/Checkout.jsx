import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";
import { clearCartThunk, getOrderByUserThunk } from "../../redux/cart";
import { addNewHistoryThunk } from "../../redux/history";
import { getSubtotal } from './OrderHelper';

export default function Checkout() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const { closeModal } = useModal()
    const user = useSelector(state => state.session)
    const instruments = useSelector(state => state.instruments)
    const orders = useSelector(state => state.orders?.CurrentOrders)
    const instArr = Object.values(instruments)?.slice(0, orders?.length)

    const subtotal = getSubtotal(instArr, orders)

    useEffect(() => {
        if (!user) {
            nav('/')
        }
        dispatch(getOrderByUserThunk())
    }, [dispatch, user])

    const handleCheckout = async (e) => {
        e.preventDefault()
        orders.forEach(async order => {
            await dispatch(addNewHistoryThunk({instrument_id: order.instrument_id, quantity: order.quantity}))
        })
        await dispatch(clearCartThunk())
        closeModal()
        alert('Congratulations! You are ready for your music journey!')
        nav(`/`)
    }

    return (
        <div className='delete-instrument-modal'>
            <div className='delete-form-container'>
                <h1 className='confirm-text'>Please Confirm Your Subtotal</h1>
                <h3>${subtotal}</h3>
                <button className='modal-btn confirm-btn' onClick={handleCheckout}>Checkout</button>
                <button className='modal-btn' onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}