import "./List.css"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyListsThunk } from "../../redux/list"
import Loading from "../Loading/Loading";
import { NavLink, useNavigate } from "react-router-dom"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ListOptionModal from "./ListOptionModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useModal } from "../../context/Modal";
import CreateListModal from "./CreateListModal";

export default function AllLists() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const user = useSelector(state => state.session.user)
    const lists = useSelector(state => state.lists?.My_Lists)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdatedAllLists, setIsUpdatedAllLists] = useState(false)
    const [hasDeleted, setHasDeleted] = useState(false)

    const isError = useSelector(state => state.lists?.error)

    const reRenderOnDelete = () => {
        setHasDeleted(!hasDeleted)
    }

    const listNames = new Set()
    lists?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(
            <CreateListModal
                isUpdatedAllLists={isUpdatedAllLists}
                setIsUpdatedAllLists={setIsUpdatedAllLists}
            />)
    }

    useEffect(() => {
        if (!user) {
            return nav('/')
        }
        dispatch(getAllMyListsThunk())
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
        
        console.log('triggered hasDeleted !', hasDeleted)
    }, [dispatch, isUpdatedAllLists, hasDeleted])

    // useEffect(() => {
    //     window.location.reload();
    // })

    if (isLoading) {
        return <Loading />
    }


// "Cannot fetch list"
    return (
        <section className="page-container">
            {lists?.length > 0
            && !isError
            // && isListsExists
             ? (
                <section className="page-content-container">
                    <h1 className="page-title">My Lists</h1>
                    <section className="all-list-tabs-container">
                        <div className="stock-page-action-btn-container">
                            <button className="stock-page-action-btn"
                                onClick={handleOpenModal}
                            >
                                Create New List
                            </button>
                        </div>
                        {Array.from(listNames).map((listName) => (
                            <section className="list-three-dots-container" key={listName}>
                                <NavLink to={`/my_lists/${listName}`} className="list-tab all-lists-tab">
                                    <h2 className="list-tab-title">{listName}</h2>
                                </NavLink>
                                <div className="three-dot-btn">
                                    <OpenModalMenuItem
                                        itemText={<BsThreeDotsVertical />}
                                        className="three-dots"
                                        modalComponent={
                                            <ListOptionModal
                                                listNameToRemove={listName}
                                                reRenderOnDelete={reRenderOnDelete}
                                                setHasDeleted={setHasDeleted}
                                            />}
                                    />
                                </div>
                            </section>
                        ))}
                    </section>
                </section>
            ) : (
                <section className="page-content-container">
                    <h2 className="not-found-message">Start Creating your List!</h2>
                    <button className="stock-page-action-btn"
                        onClick={handleOpenModal}
                    >
                        Create New List
                    </button>
                </section>
            )}
        </section>
    );
}
