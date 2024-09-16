const LOAD_STOCK = 'stocks/LOAD_STOCK'
const LOAD_MULTIPLE_STOCK = 'stocks/LOAD_MULTIPLE_STOCK'

const loadStock = (stock) => ({
    type: LOAD_STOCK,
    payload: stock
})
const loadMultipleStocks = (stocks) => ({
    type: LOAD_MULTIPLE_STOCK,
    payload: stocks
})

export const getOneStockThunk = (symbol) => async (dispatch) => {
    const res = await fetch(`/api/stocks/${symbol}`)
    if (!res.ok) {
        console.error('Failed to fetch stock'); // Add this line
        return new Error('Failed to fetch stock');
    }
    const data = await res.json();
    if (data.errors) {
        console.error('Cannot find stock'); // Add this line
        return "Cannot find stock";
    }
    console.log('Fetched stock data:', data); // Add this line
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

function stockReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_STOCK:
            return { ...state, ...action.payload }
        case LOAD_MULTIPLE_STOCK:
            return { ...state, multiple_stocks: { ...state.multiple_stocks, ...action.payload } };
        default:
            return state
    }
}

export default stockReducer