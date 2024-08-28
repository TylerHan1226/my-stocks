const LOAD_STOCK = 'stocks/load'
const LOAD_STOCK_DATA = 'stocks/loadData'
const LOAD_ALL_STOCKS = 'stocks/loadAll'

const loadStock = (stock) => ({
    type: LOAD_STOCK,
    payload: stock
})

const loadStockData = (stock, symbol) => ({
    type: LOAD_STOCK_DATA,
    symbol,
    payload: stock
})

const loadStocks = (stocks) => ({
    type: LOAD_ALL_STOCKS,
    payload: stocks
})

export const getStockThunk = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${symbol}`)
    if (response.ok) {
        const data = await response.json()
        if (data.errors) {
            return
        }
        dispatch(loadStock(data));
    }
}
// export const getStockDataThunk = (symbol) => async (dispatch) => {
//     const response = await fetch(`/api/stocks/${symbol}/data`)
//     if (response.ok) {
//         const data = await response.json()
//         dispatch(loadStockData(data, symbol))
//     }
// }
export const getAllStocksThunk = () => async (dispatch) => {
    const response = await fetch(`/api/stocks/all`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadStocks(data))
    }
}


const initialState = {}

function stockReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_STOCK:
            return { ...state, [action.payload.ticker]: action.payload }
        // case LOAD_STOCK_DATA:
        //     const newState = { ...state }
        //     const ticker = action.ticker
        //     newState[ticker] = { ...newState[ticker], ...action.payload }
        //     return newState
        case LOAD_ALL_STOCKS:
            return { stocks: action.payload, ...state }
        default:
            return state
    }
}

export default stockReducer