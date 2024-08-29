import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list"
import "./List.css"

export default function AllLists() {
    const dispatch = useDispatch();
    const lists = useSelector(state => state.lists?.My_Lists)

    const listNames = new Set()

    console.log('lists ==>', lists)
    lists?.forEach(ele => {
        listNames.add(ele.list_name)
    })
    console.log('listNames ==>', listNames)

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch]);

    return (
        <section className="page-container">
            <h1 className="page-title">My Lists</h1>
            <section className="list-tabs-container">
                {Array.from(listNames).map((eachName) => (
                <div className="list-tab">
                    <h2>{eachName}</h2>
                </div>
                ))}
            </section>

            {/* {lists?.map((eachList) => (
                <div key={eachList?.id}>
                    <p>{eachList?.stock_symbol}</p>
                </div>
            ))} */}
        </section>
    );
}