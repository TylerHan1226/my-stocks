
// Action Creators
export const LOAD_USER_FAVORITES = 'favorite/LOAD_USER_FAVORITES'
export const ADD_TO_FAVORITES = 'favorite/ADD_TO_FAVORITES'
export const REMOVE_FAVORITE = 'favorite/REMOVE_FAVORITE'

// Action Types
export const loadUserFavorites = (favorites) => ({
    type: LOAD_USER_FAVORITES,
    favorites
})
export const addToHistory = (newFavorite) => ({
    type: ADD_TO_FAVORITES,
    newFavorite
})
export const removeFav = (favToDelete) => ({
    type: REMOVE_FAVORITE,
    favToDelete
})



// Get user favorites
export const getUserFavThunk = () => async (dispatch) => {
    const res = await fetch('/api/favorites/current')
    if (!res.ok) {
        throw new Error('Failed to fetch favorites by user')
    }
    const favorites = await res.json()
    if (favorites.errors) {
        return favorites.errors
    }
    dispatch(loadUserFavorites(favorites))
    return favorites
}
// Add new favorite
export const addToFavoriteThunk = (newFavData) => async (dispatch) => {
    const res = await fetch('/api/favorites/new', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newFavData)
    })
    if (!res.ok) {
        throw new Error('Failed to create new favorite')
    }
    const newFav = await res.json()
    dispatch(addToHistory(newFav))
    return newFav
}
// Delete Order by id
export const removeFavThunk = (favId) => async (dispatch) => {
    const res = await fetch(`/api/favorites/${favId}/delete`, {
        method: 'DELETE'
    })
    if (res.ok) {
        const favToDelete = await res.json()
        dispatch(removeFav(favToDelete))
    } else {
        throw new Error('Failed to remove favorite')
    }
}



// Favorites Reducer
export const favoriteReducer = (state={}, action) => {
    switch(action.type) {
        case LOAD_USER_FAVORITES: {
            return {...state, ...action.favorites}
        }
        case ADD_TO_FAVORITES: {
            return {...state, ...action.newFavorite}
        }
        case REMOVE_FAVORITE: {
            const deleteState = {...state}
            delete deleteState[action.favToDelete]
            return deleteState
        }
        default:
            return state
    }
}