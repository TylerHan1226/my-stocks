import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyNewsThunk } from "../../redux/news"
import './News.css'
import { NavLink } from "react-router-dom"

export default function News({ stockSymbol }) {

    const dispatch = useDispatch()
    const news = useSelector(state => state.news?.my_news)
    // show more
    const [isShowMore, setIsShowMore] = useState(false)
    const handleShowMore = () => {
        setIsShowMore(prev => !prev)
    }
    const newsToDisplay = isShowMore ? news : news?.slice(0, 3)

    useEffect(() => {
        dispatch(getMyNewsThunk([stockSymbol]))
    }, [dispatch])

    return (
        <section className="news-page-container">
            <div className="news-page-header">
                <h2 className="search-info-title">News</h2>
                <NavLink className="news-show-more" onClick={handleShowMore}>
                    Show More
                </NavLink>
            </div>
            <div className="news-container">
                {newsToDisplay?.map((eachNews, index) => (
                    <NavLink className="news-tabs" key={index} to={eachNews.link} target='_blank'>
                        <div className="news-info-container">
                            <p className="news-publisher">{eachNews.publisher} | {eachNews.date?.split('T')[0]} {eachNews.date?.split('T')[1].slice(0, -4)}</p>
                            <p>{eachNews.title}</p>
                        </div>
                        <img className="landing-news-img" src={eachNews.image_url} />
                    </NavLink>
                ))}
            </div>

        </section>

    )
}