const LOAD_STOCK = 'stocks/load'

const loadStock = (stock) => ({
    type: LOAD_STOCK,
    payload: stock
})

export const getOneStockThunk = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${symbol}`)
    if (!response.ok) {
        return new Error ('Failed to fetch stock')
    }
    const data = await response.json()
    if (data.errors) {
        return "Cannot find stock"
    }
    dispatch(loadStock(data));
    return data
}

const initialState = {}

function stockReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_STOCK:
            return { ...state, ...action.payload }
        default:
            return state
    }
}

export default stockReducer