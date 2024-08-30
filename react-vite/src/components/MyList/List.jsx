import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list"
import "./List.css"
import { useParams } from "react-router-dom";

export default function List() {
    const dispatch = useDispatch();
    const list = useParams()

    console.log("list =>", list)

    useEffect(() => {
        
    }, [dispatch]);

    return (
        <section className="page-container">
            <section className="page-content-container">
                <h1 className="page-title">{list.listName}</h1>
            </section>
        </section>
    );
}