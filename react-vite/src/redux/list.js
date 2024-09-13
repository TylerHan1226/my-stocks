export const LOAD_ALL_MY_LISTS = 'list/LOAD_ALL_MY_LISTS'
export const LOAD_ALL_STOCK_INFO_UNDER_LIST = 'list/LOAD_ALL_STOCK_INFO_UNDER_LIST'
export const ADD_LIST = 'list/ADD_LIST'
export const UPDATE_LIST = 'list/UPDATE_LIST'
export const UPDATE_LIST_NAMES = 'list/UPDATE_LIST_NAMES'
export const REMOVE_STOCK = 'list/REMOVE_STOCK'
export const REMOVE_LIST = 'list/REMOVE_LIST'

export const loadAllMyLists = (lists) => ({
    type: LOAD_ALL_MY_LISTS,
    payload: lists
})
export const loadAllStockInList = (listStocks) => ({
    type: LOAD_ALL_STOCK_INFO_UNDER_LIST,
    payload: listStocks
})
export const addList = (newList) => ({
    type: ADD_LIST,
    payload: newList
})
export const updateList = (updatedList) => ({
    type: UPDATE_LIST,
    payload: updatedList
})
export const updateListNames = (updatedLists) => ({
    type: UPDATE_LIST_NAMES,
    payload: updatedLists
})
export const removeStock = (removedStock) => ({
    type: REMOVE_STOCK,
    payload: removedStock
})
export const removeList = (removedList) => ({
    type: REMOVE_LIST,
    payload: removedList
})



// // Helper function to get CSRF token from cookies
// function getCookie(name) {
//     const value = `; ${document.cookie}`
//     const parts = value.split(`; ${name}=`)
//     if (parts.length === 2) return parts.pop().split(';').shift()
// }

export const getAllMyListsThunk = () => async (dispatch) => {
    const res = await fetch('/api/lists/')
    if (!res.ok) {
        throw new Error('Failed to fetch lists')
    }
    const data = await res.json()
    dispatch(loadAllMyLists(data))
    return data
}
export const getAllStocksInListThunk = (list_id) => async (dispatch) => {
    try {
        const res = await fetch(`/api/lists/${list_id}/stocks`)
        if (!res.ok) {
            throw new Error(`Failed to fetch stocks in the list: ${res.statusText}`)
        }
        const data = await res.json()
        dispatch(loadAllStockInList(data))
        return data
    } catch (error) {
        console.error('Error fetching stocks: ', error)
        throw error
    }

}
export const addListThunk = (newListData) => async (dispatch) => {
    // can receive object {"list_name": listName, "stock_symbol": stockSymbol}
    const formData = new FormData();
    for (const key in newListData) {
        formData.append(key, newListData[key]);
    }

    const res = await fetch('/api/lists/new', {
        method: 'POST',
        body: formData,
    })
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
    }
    const newList = await res.json()
    dispatch(addList(newList))
    return newList
}
export const updateListThunk = (updatedListData, listId) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}/update`, {
        method: 'PUT',
        body: updatedListData
    })
    if (!res.ok) {
        throw new Error('Failed to update list')
    }
    const updatedList = await res.json()
    dispatch(updateList(updatedList))
    return updatedList
}
export const updateListNamesThunk = (updatedListNameData, selectedListName) => async (dispatch) => {
    const formData = new FormData();
    for (const key in updatedListNameData) {
        formData.append(key, updatedListNameData[key]);
    }
    const res = await fetch(`/api/lists/${selectedListName}/edit-name`, {
        method: 'PUT',
        body: formData
    })
    if (!res.ok) {
        throw new Error('Failed to update list names')
    }
    const updatedLists = await res.json()
    dispatch(updateListNames(updatedLists))
    return updatedLists
}
export const removeStockThunk = (listId) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}/remove`, {
        method: 'DELETE',
    })
    if (!res.ok) {
        throw new Error('Failed to remove list')
    }
    const removedStock = await res.json()
    dispatch(removeStock(removedStock))
}
export const removeListThunk = (listName) => async (dispatch) => {
    const res = await fetch(`/api/lists/remove-list/${listName}`, {
        method: 'DELETE'
    })
    if (!res.ok) {
        throw new Error('Failed to remove lists by name')
    }
    const removedList = await res.json()
    dispatch(removeList(removedList))
    return removedList
}

const initialState = {}

function listReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_ALL_MY_LISTS: {
            return { ...state, ...action.payload }
        }
        case LOAD_ALL_STOCK_INFO_UNDER_LIST: {
            return { ...state, ...action.payload }
        }
        case ADD_LIST: {
            return { ...state, ...action.payload }
        }
        case UPDATE_LIST: {
            return { ...state, ...action.payload }
        }
        case UPDATE_LIST_NAMES: {
            return { ...state, ...action.payload }
        }
        case REMOVE_STOCK: {
            const deleteState = { ...state }
            delete deleteState[action.removedStock]
            return deleteState
        }
        case REMOVE_LIST: {
            const deleteState = { ...state }
            delete deleteState[action.removedList]
            return deleteState
        }
        default:
            return state
    }
}

export default listReducer