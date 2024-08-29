const LOAD_ALL_MY_LISTS = 'list/LOAD_ALL_MY_LISTS'

const loadAllMyLists = (lists) => ({
    type: LOAD_ALL_MY_LISTS,
    payload: lists
})

// Helper function to get CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}

export const getAllMyListsThunk = () => async (dispatch) => {

        const response = await fetch('/api/lists/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrf_token')
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch lists')
        }
        const data = await response.json()
        dispatch(loadAllMyLists(data))
        return data

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