
// Action Creators
export const LOAD_ALL_HISTORY = 'history/LOAD_ALL_HISTORY'
export const LOAD_HISTORY_BY_USER = 'history/LOAD_HISTORY_BY_USER'
export const ADD_TO_HISTORY = 'history/ADD_TO_HISTORY'
// export const DELETE_HISTORY = 'history/DELETE_HISTORY'


// Action Types
export const loadAllHistories = (histories) => ({
    type: LOAD_ALL_HISTORY,
    histories
})
export const loadHistoryByUser = (histories) => ({
    type: LOAD_HISTORY_BY_USER,
    histories
})
export const addToHistory = (newHistory) => ({
    type: ADD_TO_HISTORY,
    newHistory
})
// export const deleteHistory = (historyToDelete) => {
//     type: DELETE_HISTORY,
//     historyToDelete
// }



// Get all histories
export const getAllHistoriesThunk = () => async (dispatch) => {
    const res = await fetch('/api/history')
    if (!res.ok) {
        throw new Error('Failed to fetch all histories')
    }
    const histories = await res.json()
    if (histories.errors) {
        return histories.errors
    }
    dispatch(loadAllHistories(histories))
    return histories
}
// Get History by User
export const getUserHistoryThunk = () => async (dispatch) => {
    const res = await fetch('/api/history/current')
    if (!res.ok) {
        throw new Error('Failed to fetch history by user')
    }
    const histories = await res.json()
    if (histories.errors) {
        return histories.errors
    }
    dispatch(loadHistoryByUser(histories))
    return histories
}
// Add new history
export const addNewHistoryThunk = (newHistoryData) => async (dispatch) => {
    const res = await fetch('/api/history/new', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newHistoryData)
    })
    if (!res.ok) {
        throw new Error('Failed to create new history')
    }
    const newHistory = await res.json()
    dispatch(addToHistory(newHistory))
    return newHistory
}


// History Reducer
export const historyReducer = (state={}, action) => {
    switch(action.type) {
        case LOAD_ALL_HISTORY: {
            return {...state, ...action.histories}
        }
        case LOAD_HISTORY_BY_USER: {
            return {...state, ...action.histories}
        }
        case ADD_TO_HISTORY: {
            return {...state, ...action.newHistory}
        }
        default:
            return state
    }
}

