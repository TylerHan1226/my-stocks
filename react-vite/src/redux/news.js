
// Action Creators
export const LOAD_MARKET_NEWS = 'news/LOAD_MARKET_NEWS'
export const LOAD_MY_NEWS = 'news/LOAD_MY_NEWS'

export const loadMarketNews = (news) => ({
    type: LOAD_MARKET_NEWS,
    news
})
export const loadMyNews = (news) => ({
    type: LOAD_MY_NEWS,
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
//Get Market News Thunk
export const getMyNewsThunk = (symbols) => async (dispatch) => {
    const res = await fetch(`/api/news/multiple`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbols })
    })
    if (!res.ok) {
        throw new Error('Failed to fetch news')
    }
    const news = await res.json()
    if (news.errors) {
        return news.errors
    }
    dispatch(loadMyNews(news))
    return news
}

export const newsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_MARKET_NEWS: {
            return {...state, "market_news": action.news}
        }
        case LOAD_MY_NEWS: {
            return {...state, "my_news": action.news}
        }
        default:
            return state
    }
}