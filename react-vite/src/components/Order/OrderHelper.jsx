

export const getSubtotal = (instArr, orders) => {
    return instArr?.reduce((acc, inst) => {
        const matchingOrder = orders?.find(order => order.instrument_id == inst.id)
        if (matchingOrder && inst.discount == 1) {
            return acc + (inst.price * matchingOrder.quantity)
        } else if (matchingOrder && inst.discount != 1) {
            return acc + (inst.price * inst.discount * matchingOrder.quantity)
        }
        return acc
    }, 0).toFixed(2)
}