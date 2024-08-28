
// Action Creators
export const LOAD_ALL_NEWS = 'news/LOAD_ALL_NEWS'

export const loadAllNews = (news) => ({
    type: LOAD_ALL_NEWS,
    news
})

//Get All News Thunk
export const getAllNewsThunk = (page) => async (dispatch) => {
    const res = await fetch(`/api/news/${page}`)
    if (!res.ok) {
        throw new Error('Failed to fetch news')
    }
    const news = await res.json()
    if (news.errors) {
        return news.errors
    }
    dispatch(loadAllNews(news))
    return news
}

export const newsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALL_NEWS: {
            return {...state, "News": action.news}
        }
        default:
            return state
    }
}