const LOAD_STOCK = 'stocks/LOAD_STOCK'
const LOAD_MULTIPLE_STOCK = 'stocks/LOAD_MULTIPLE_STOCK'
const LOAD_STOCKS_TO_COMPARE = 'stocks/LOAD_STOCKS_TO_COMPARE'

const loadStock = (stock) => ({
    type: LOAD_STOCK,
    payload: stock
})
const loadMultipleStocks = (stocks) => ({
    type: LOAD_MULTIPLE_STOCK,
    payload: stocks
})
const loadStocksToCompare = (stocks) => ({
    type: LOAD_STOCKS_TO_COMPARE,
    payload: stocks
})

export const getOneStockThunk = (symbol) => async (dispatch) => {
    const res = await fetch(`/api/stocks/${symbol}`)
    if (!res.ok) {
        return new Error('Failed to fetch stock')
    }
    const data = await res.json();
    if (data.errors) {
        return "Cannot find stock";
    }
    dispatch(loadStock(data));
    return data;
}
export const getMultipleStocksThunk = (symbols) => async (dispatch) => {
    const res = await fetch('/api/stocks/multiple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbols })
    })
    if (!res.ok) {
        return new Error('Failed to fetch multiple stocks')
    }
    const data = await res.json()
    if (data.errors) {
        return "Cannot find stocks"
    }
    dispatch(loadMultipleStocks(data))
    return data
}
export const getStocksToCompareThunk = (symbols) => async (dispatch) => {
    const res = await fetch('/api/stocks/compare', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbols })
    })
    if (!res.ok) {
        return new Error('Failed to fetch stocks')
    }
    const data = await res.json()
    if (data.errors) {
        return "Cannot find stocks"
    }
    dispatch(loadStocksToCompare(data))
    return data
}

function stockReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_STOCK:
            return { ...state, ...action.payload }
        case LOAD_MULTIPLE_STOCK:
            return { ...state, multiple_stocks: { ...state.multiple_stocks, ...action.payload } };
        case LOAD_STOCKS_TO_COMPARE:
            return { ...state, stocks_to_compare: { ...state.stocks_to_compare, ...action.payload } };
        default:
            return state
    }
}

export default stockReducer