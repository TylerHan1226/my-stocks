import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk, removeListThunk } from "../../redux/list"

export default function AllLists() {
    const dispatch = useDispatch();
    const lists = useSelector(state => state.lists?.My_Lists)

    console.log('lists ==>', lists)

    useEffect(() => {
        dispatch(getAllMyListsThunk())
    }, [dispatch]);

    return (
        <section className="page-container">
            <h1>My Lists!</h1>
            {lists?.map((eachList) => (
                <div key={eachList?.id}>
                    <p>{eachList?.list_name}</p>
                </div>
            ))}
        </section>
    );
}