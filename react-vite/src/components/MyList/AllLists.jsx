import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list"
import "./List.css"
import { NavLink, useNavigate } from "react-router-dom"

export default function AllLists() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const lists = useSelector(state => state.lists?.My_Lists)
    // get list name array
    const listNames = new Set()
    lists?.forEach(ele => {
        listNames.add(ele.list_name)
    })


    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch]);

    return (
        <section className="page-container">
            <section className="page-content-container">
                <h1 className="page-title">My Lists</h1>
                <section className="list-tabs-container">
                    {Array.from(listNames).map((listName) => (
                        <NavLink to={`/my_lists/${listName}`} className="list-tab" key={listName}>
                            <h2 className="list-tab-title">{listName}</h2>
                        </NavLink>
                    ))}
                </section>

            </section>


            {/* {lists?.map((eachList) => (
                <div key={eachList?.id}>
                    <p>{eachList?.stock_symbol}</p>
                </div>
            ))} */}
        </section>
    );
}