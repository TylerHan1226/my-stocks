import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { getAllInstrumentsThunk } from "../../redux/instrument"
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import DeleteInstrument from '../Instrument/DeleteInstrument'
import './MyInstruments.css'


export default function MyInstruments() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const instruments = useSelector(state => state.instruments.Instruments)

    const [deletedInstrument, setDeleteInst] = useState(false)

    const reRenderOnDelete = () => {
        setDeleteInst(!deletedInstrument)
    }

    useEffect(() => {
        dispatch(getAllInstrumentsThunk())
    }, [dispatch, deletedInstrument])

    if (!user || !instruments) {
        <h2>Loading...</h2>
    }

    const myInstruments = instruments?.filter(ele => ele.seller_id == user?.id)

    return (

        <div className="page-container">
            <h1>My Instruments</h1>
            <div className="my-instrument-item-container">
                {myInstruments?.length > 0 ? myInstruments?.map((eachInst) => (
                    <div className="instrument-container" key={eachInst?.id}>
                        <div className="instrument-dtl-container">
                            <NavLink to={`${eachInst?.id}`}>
                                <img className="instrument-image" src={eachInst?.image_url} />
                            </NavLink>
                        </div>
                        <div className="instrument-dtl-container">
                            <h4 className="black-text">{eachInst?.model}</h4>
                            <p className="black-text">{eachInst?.category}</p>
                            
                            {eachInst.discount < 1 ? (
                                <div className='myInstr-discount-price-container'>
                                    <p className="black-text-bold discount-price">
                                        ${eachInst.price}
                                    </p>
                                    <p className="black-text-bold">
                                        ${(eachInst.price * eachInst.discount).toFixed(2)}
                                    </p>
                                </div>
                            ) : 
                                (<p className="black-text">${eachInst?.price}</p>
                            )}

                            {eachInst?.is_used ? (
                                <p className="black-text">Pre-owned</p>
                            ) : (
                                <p className="black-text">New</p>
                            )}
                        </div>
                        <div className="my-inst-item-btn-container">
                            <button className="my-inst-action-btn">
                                <NavLink className='add-to-cart-text my-inst-update-btn' to={`${eachInst?.id}/update`}>
                                    Update
                                </NavLink>
                            </button>
                            <button className="delete-button my-inst-action-btn">
                                <OpenModalMenuItem
                                    itemText='Delete Instrument'
                                    modalComponent={<DeleteInstrument instrumentId={eachInst?.id} reRenderOnDelete={reRenderOnDelete} />}
                                />
                            </button>
                        </div>
                    </div>
                )) : (
                    <h3>You have&apos;t posted any instrument yet</h3>
                )}
            </div>

        </div>
    )

}

