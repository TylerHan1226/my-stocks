import "./List.css"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk } from "../../redux/list"
import Loading from "../Loading/Loading";
import { NavLink, useNavigate } from "react-router-dom"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { BsThreeDotsVertical } from "react-icons/bs";
import ListOptionModal from "./ListOptionModal";

export default function AllLists() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const lists = useSelector(state => state.lists?.My_Lists)
    const [isLoading, setIsLoading] = useState(true)
    const fetchErr = useSelector(state => state.lists?.error)

    const listNames = new Set()
    lists?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    useEffect(() => {
        dispatch(getAllMyListsThunk())
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [dispatch])

    if (!user) {
        return nav('/')
    }
    if (isLoading) {
        return <Loading />
    }

    return (
        <section className="page-container">
            {lists?.length > 0 && !fetchErr ? (
                <section className="page-content-container">
                    <h1 className="page-title">My Lists</h1>
                    <section className="all-list-tabs-container">
                        {Array.from(listNames).map((listName) => (
                            <section className="list-three-dots-container" key={listName}>
                                <NavLink to={`/my_lists/${listName}`} className="list-tab all-lists-tab">
                                    <h2 className="list-tab-title">{listName}</h2>
                                </NavLink>
                                <div className="three-dot-btn">
                                    <OpenModalMenuItem
                                        itemText={<BsThreeDotsVertical />}
                                        className="three-dots"
                                        modalComponent={<ListOptionModal
                                            listToRemove={listName}
                                        />}
                                    />
                                </div>
                            </section>
                        ))}
                    </section>
                </section>
            ) : (
                <section>
                <h2 className="not-found-message">Start Creating your List!</h2>
                </section>


            )}
        </section>
    );
}
