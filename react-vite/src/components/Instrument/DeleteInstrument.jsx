import { useDispatch, useSelector } from "react-redux";
import { deleteInstrumentThunk, getOneInstrumentThunk } from "../../redux/instrument";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";


export default function DeleteInstrument({instrumentId, reRenderOnDelete}) {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const { closeModal } = useModal()
    
    const instrument = useSelector(state => state.instruments)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        if (!user) {
            nav('/')
        }
        dispatch(getOneInstrumentThunk(instrumentId))
    }, [dispatch, instrumentId])

    const deleteInstrument = async (e) => {
        e.preventDefault()
        dispatch(deleteInstrumentThunk(instrument.id))
        closeModal()
        reRenderOnDelete()
        nav(`/instruments/:userId/MyInstruments`)
    }

    return (
        <section className='delete-instrument-modal'>
            <div className='delete-form-container'>
                <h1 className='remove-inst-title'>Are you sure you want to remove this instrument from Riff Harbor?</h1>
                <button className='modal-btn confirm-btn' onClick={deleteInstrument}>Remove My Instrument</button>
                <button className='modal-btn' onClick={closeModal}>Cancel</button>
            </div>
        </section>
    )


}