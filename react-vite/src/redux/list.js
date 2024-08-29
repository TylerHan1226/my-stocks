export const LOAD_ALL_MY_LISTS = 'list/LOAD_ALL_MY_LISTS'
export const ADD_LIST = 'list/ADD_LIST'
export const UPDATE_LIST = 'list/UPDATE_LIST'
export const REMOVE_LIST = 'list/REMOVE_LIST'

export const loadAllMyLists = (lists) => ({
    type: LOAD_ALL_MY_LISTS,
    payload: lists
})
export const addList = (list) => ({
    type: ADD_LIST,
    payload: list
})
export const updateList = (list) => ({
    type: UPDATE_LIST,
    payload: list
})
export const removeList = (list) => ({
    type: REMOVE_LIST,
    payload: list
})



// Helper function to get CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}

export const getAllMyListsThunk = () => async (dispatch) => {
        const res = await fetch('/api/lists/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrf_token')
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch lists')
        }
        const data = await res.json()
        dispatch(loadAllMyLists(data))
        return data
}
export const addListThunk = (newListData) => async (dispatch) => {
    const res = await fetch('/api/lists/new', {
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrf_token')
        },
        body: newListData
    })
    if (!res.ok) {
        throw new Error('Failed to add list')
    }
    const newList = await res.json()
    dispatch(addList(newList))
    return newList
}
export const updateListThunk = (updatedListData, listId) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}/update`, {
        method: 'PUT', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrf_token')
        },
        body: updatedListData
    })
    if (!res.ok) {
        throw new Error('Failed to update list')
    }
    const updatedList = await res.json()
    dispatch(updateList(updatedList))
    return updatedList
}
export const removeListThunk = (listId) => async (dispatch) => {
    const res = await fetch(`api/lists/${listId}/remove`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrf_token')
        },
    })
    if (!res.ok) {
        throw new Error('Failed to remove list')
    }
    const removedRes = await res.json()
    dispatch(removeList(removedRes))
}

const initialState = {}

function listReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_ALL_MY_LISTS: {
            return { ...state, ...action.payload }
        }
        default:
            return state
    }
}

export default listReducer