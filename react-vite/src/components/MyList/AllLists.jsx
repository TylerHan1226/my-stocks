import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk } from "../../redux/list"
import Loading from "../Loading/Loading";
import "./List.css"
import { NavLink, useNavigate } from "react-router-dom"

export default function AllLists() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const lists = useSelector(state => state.lists?.My_Lists)
    const [isLoading, setIsLoading] = useState(true)
    
    const listNames = new Set()
    lists?.forEach(ele => {
        listNames.add(ele.list_name)
    })
    console.log('lists =>', lists)
    lists?.map((eachList) => {
        console.log('eachList.list_name ==>',eachList.list_name)
    })

    useEffect(() => {
        dispatch(getAllMyListsThunk())
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [dispatch]);

    if (!user) {
        return nav('/')
    }
    if (isLoading) {
        return <Loading />
    }
    
    return (
        <section className="page-container">
            <section className="page-content-container">
                <h1 className="page-title">My Lists</h1>
                <section className="list-three-dots-container"></section>
                <section className="list-tabs-container">
                    {Array.from(listNames).map((listName) => (
                        <NavLink to={`/my_lists/${listName}`} className="list-tab all-lists-tab" key={listName}>
                            <h2 className="list-tab-title">{listName}</h2>
                        </NavLink>
                    ))}
                </section>
            </section>
        </section>
    );
}