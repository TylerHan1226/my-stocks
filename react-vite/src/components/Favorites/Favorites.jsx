
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavThunk } from "../../redux/favorite";

import './Favorites.css'



export default function Favorites() {
    const nav = useNavigate()
    const dispatch = useDispatch()

    const favorites = useSelector(state => state.favorites?.FavInst)
    const user = useSelector(state => state.session.user)

    if (!user) {
        nav('/')
    }

    const handleNavToDtl = (instrumentId) => {
        nav(`/instruments/${instrumentId}`)
    }

    useEffect(() => {
        dispatch(getUserFavThunk())
    }, [dispatch])

    return (
        <div className="page-container">
            <h1>My Favorites</h1>
            <section className="fav-instruments-container">
                {favorites?.map(instrument => (
                    <button className="fav-instrument" key={instrument.id} onClick={() => handleNavToDtl(instrument.id)}>
                        <img className="fav-inst-img" src={instrument.image_url} />
                        <h3 className="fav-inst-model black-text">{instrument.model}</h3>
                        <h4 className="fav-inst-color red-text">{instrument.color}</h4>
                    </button>
                ))}

            </section>
        </div>
    )
}
