import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllNewsThunk } from "../../redux/news";
import './News.css'

export default function News() {
    const nav = useNavigate()
    const { page } = useParams()

    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(parseInt(page) || 1)

    const news = useSelector(state => state.news)?.News

    useEffect(() => {
        dispatch(getAllNewsThunk(currentPage))
    }, [dispatch, currentPage, page])

    const handlePageNum = (pageNumber) => {
        setCurrentPage(pageNumber)
        nav(`/news/${pageNumber}`)
        window.scrollTo(0, 0)
    }
    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
        nav(`/news/${currentPage - 1}`)
        window.scrollTo(0, 0)
    }
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
        nav(`/news/${currentPage + 1}`)
        window.scrollTo(0, 0)
    }

    return (
        <div className="page-container">
            <h1>News</h1>
            <div className="news-container">
                {
                    news?.map(ele => (
                        <div className="news-tab" key={ele.url}>
                            <div className="news-text-container">
                                <h2>{ele.title}</h2>
                                <h3>Author: {ele.author}</h3>
                                <p className="news-text">Publish Date: {ele.publishedAt.split("T")[0]}</p>
                                <p className="news-text">Source: {ele.source.name}</p>
                                <p className="news-text">{ele.description}</p>
                                <a href={`${ele.url}`} target="_blank" rel="noreferrer">
                                    <button className="news-readMore">Read More</button>
                                </a>
                            </div>
                            <div className="news-image-container">
                                <a href={`${ele.url}`} target="_blank" rel="noreferrer">
                                    <img className="news-image" src={ele.urlToImage} />
                                </a>
                            </div>
                        </div>
                    ))
                }
                <div className="news-page-btn">
                    {
                        currentPage != 1 && (
                            <button className="news-btns" onClick={() => handlePrevPage()}>Previous</button>
                        )
                    }
                  {[1, 2, 3, 4, 5].map(pageNumber => (
                        <button
                            key={pageNumber}
                            className={`news-btns ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => handlePageNum(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    {
                        currentPage != 5 && (
                            <button className="news-btns" onClick={() => handleNextPage()}>Next</button>
                        )
                    }
                </div>
            </div>

        </div>
    )
}