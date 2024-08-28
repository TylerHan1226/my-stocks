
// Action Creators
export const LOAD_ALL_ORDER_ITEMS = 'cart/LOAD_ALL_ORDER_ITEMS'
export const LOAD_ORDER_BY_USER = 'cart/LOAD_ORDER_BY_USER'
export const LOAD_ORDER_BY_ID = 'cart/LOAD_ORDER_BY_ID'
export const CREATE_ORDER = 'cart/CREATE_ORDER'
export const UPDATE_ORDER = 'cart/UPDATE_ORDER'
export const DELETE_ORDER = 'cart/DELETE_ORDER'
export const CLEAR_CART = 'cart/CLEAR_CART'


// Action Types
export const loadAllOrders = (orders) => ({
    type: LOAD_ALL_ORDER_ITEMS,
    orders
})
export const loadOrdersByUser = (orders) => ({
    type: LOAD_ORDER_BY_USER,
    orders
})
export const loadOrderById = (order) => ({
    type: LOAD_ORDER_BY_ID,
    order
})
export const createOrder = (newOrder) => ({
    type: CREATE_ORDER,
    newOrder
})
export const updateOrder = (updatedOrder) => ({
    type: UPDATE_ORDER,
    updatedOrder
})
export const deleteOrder = (orderToDelete) => ({
    type: DELETE_ORDER,
    orderToDelete
})
export const clearCart = (allItems) => ({
    type: CLEAR_CART,
    allItems
})


// Get All Orders
export const getAllOrdersThunk = () => async (dispatch) => {
    const res = await fetch('/api/orders')
    if (!res.ok) {
        throw new Error('Failed to fetch all orders')
    }
    const orders = await res.json()
    if (orders.errors){
        return orders.errors
    }
    dispatch(loadAllOrders(orders))
    return orders
}

// Get Orders by current user
export const getOrderByUserThunk = () => async (dispatch) => {
    const res = await fetch('/api/orders/current')
    if (!res.ok) {
        throw new Error('Failed to fetch the orders by current user')
    }
    const orders = await res.json()
    if (orders.errors){
        return orders.errors
    }
    dispatch(loadOrdersByUser(orders))
    return orders
}

// Get Order by id
export const getOrderByIdThunk = (orderId) => async (dispatch) => {
    const res = await fetch(`/api/orders/${orderId}`)
    if (!res.ok) {
        throw new Error('Failed to fetch the order by id')
    }
    const order = await res.json()
    if (order.errors) {
        return order.errors
    }
    dispatch(loadOrderById(order))
    return order
}

// Create an Order
export const createOrderThunk = (newOrderData) => async (dispatch) => {
    const res = await fetch('/api/orders/new', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newOrderData)
    })
    if (!res.ok) {
        throw new Error('Failed to place order')
    }
    const newOrder = await res.json()
    dispatch(createOrder(newOrder))
    return newOrder
}

// Update an Order
export const updateOrderThunk = (orderId, updatedOrderData) => async (dispatch) => {
    const res = await fetch(`/api/orders/${orderId}/update`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedOrderData)
    })
    if (!res.ok) {
        throw new Error('Failed to update order')
    }
    const updatedOrder = await res.json()
    dispatch(updateOrder(updatedOrder))
    return updatedOrder
}

// Delete Order by id
export const deleteOrderThunk = (orderId) => async (dispatch) => {
    const res = await fetch(`/api/orders/${orderId}/delete`, {
        method: 'DELETE'
    })
    if (res.ok) {
        const orderToDelete = await res.json()
        dispatch(deleteOrder(orderToDelete))
    } else {
        throw new Error('Failed to delete order')
    }
}

// Clear Cart / Checkout
export const clearCartThunk = () => async (dispatch) => {
    const res = await fetch(`/api/orders/current/clear`, {
        method: 'DELETE'
    })
    if (res.ok) {
        const orders = await res.json()
        dispatch(clearCart(orders))
    } else {
        throw new Error('Failed to clear cart')
    }
}

// Order Reduce
export const orderReducer = (state={}, action) => {
    switch (action.type) {
        case LOAD_ALL_ORDER_ITEMS: {
            return {...state, ...action.orders}
        }
        case LOAD_ORDER_BY_USER: {
            return {...state, ...action.orders}
        }
        case LOAD_ORDER_BY_ID: {
            return {...state, ...action.order}
        }
        case CREATE_ORDER: {
            return {...state, ...action.newOrder}
        }
        case UPDATE_ORDER: {
            return {...state, ...action.updatedOrder}
        }
        case DELETE_ORDER: {
            const deleteState = {...state}
            delete deleteState[action.orderToDelete]
            return deleteState
        }
        case CLEAR_CART: {
            const deleteState = {...state}
            delete deleteState[action.allItems]
            return deleteState
        }
        default:
            return state
    }
}

