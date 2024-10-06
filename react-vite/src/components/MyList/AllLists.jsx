import "./List.css"
import { useEffect, useState } from "react"
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

    const listNames = new Set()
    lists?.forEach(ele => {
        listNames.add(ele.list_name)
    })

    const { setModalContent } = useModal()
    const handleOpenModal = () => {
        setModalContent(<CreateListModal/>)
    }

    useEffect(() => {
        if (!user) {
            return nav('/')
        }
        dispatch(getAllMyListsThunk())
            .then(() => setIsLoading(false))
        window.scrollTo(0, 0)
    }, [dispatch])

    if (isLoading) {
        return (
            <section className="page-container">
                <section className="page-content-container">
                    <Loading />
                </section>
            </section>
        )
    }

    return (
        <section className="page-container">
            {lists?.length > 0
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
                                                listNameSelected={listName}
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
