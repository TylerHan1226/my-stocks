
// Action Creators
export const LOAD_MARKET_NEWS = 'news/LOAD_MARKET_NEWS'

export const loadMarketNews = (news) => ({
    type: LOAD_MARKET_NEWS,
    news
})

//Get Market News Thunk
export const getMarketNewsThunk = () => async (dispatch) => {
    const res = await fetch(`/api/news/market`)
    if (!res.ok) {
        throw new Error('Failed to fetch news')
    }
    const news = await res.json()
    if (news.errors) {
        return news.errors
    }
    dispatch(loadMarketNews(news))
    return news
}

export const newsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_MARKET_NEWS: {
            return {...state, "market_news": action.news}
        }
        default:
            return state
    }
}