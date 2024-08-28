import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


import Loading from "../Loading/Loading";
import { getOneStockThunk } from "../../redux/stock";


export default function SearchPage() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { searchInput } = useParams()
    const user = useSelector(state => state.session.user)
    
    console.log("searchInput ==>", searchInput)
    
    useEffect(() => {
        dispatch(getOneStockThunk(searchInput))
    }, [nav, dispatch, searchInput])

    return (
        <div className="page-container">
            <h1>Search Page</h1>
            <h1>{searchInput}</h1>
        </div>

    );
}
