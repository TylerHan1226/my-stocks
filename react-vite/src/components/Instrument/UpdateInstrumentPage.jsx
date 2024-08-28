import { useEffect } from "react";
import InstrumentForm from "./InstrumentForm";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneInstrumentThunk } from "../../redux/instrument";

export default function UpdateInstrumentPage() {

    const buttonName = 'Update Instrument'
    const dispatch = useDispatch()
    const {instrumentId} = useParams()
    const instrument = useSelector(state => state.instruments)

    useEffect(() => {
        dispatch(getOneInstrumentThunk(instrumentId))
    }, [dispatch, instrumentId])

    if (!instrument || !instrumentId) {
        return <h2>Loading...</h2>
    }

    return (
        <div className="page-container">
            <h1>Update Your Gear!</h1>
            <InstrumentForm buttonName={buttonName} instrument={instrument} />
        </div>            
    );
}

