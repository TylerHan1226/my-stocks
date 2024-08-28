from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import db, OrderItem

import json

order_routes = Blueprint('orders', __name__)

#get all order items
# /api/orders
@order_routes.route('/')
@login_required
def all_orders():
    orders = OrderItem.query.all()
    order_list = [order.to_dict() for order in orders]
    return {'OrderItems': order_list}, 200


#get the order by current user
# /api/orders/current
@order_routes.route('/current')
@login_required
def orders_by_user():
    cur_orders = OrderItem.query.filter_by(user_id=current_user.id).all()
    cur_orders_list = [order.to_dict() for order in cur_orders]
    return {'CurrentOrders': cur_orders_list}, 200


# get the order by orderId
# /api/orders/:orderId
@order_routes.route('/<int:id>')
@login_required
def order_by_id(id):
    order = OrderItem.query.get(id)
    if not order:
        return {'message': 'Order not found'}, 404
    else:
        order_list = order.to_dict()
        return order_list, 200


# create an order
# Click the add to cart button
# /api/orders/new
@order_routes.route('/new', methods=['POST'])
@login_required
def place_order():
    data = request.json
    instrument_id = data.get('instrument_id')
    new_order = OrderItem(user_id=current_user.id, instrument_id=instrument_id, quantity=1)

    if not new_order:
        return {'message': 'Cannot Add to cart'}, 400

    db.session.add(new_order)
    db.session.commit()

    return {'message': 'Order placed successfully!'}


# update an order
# /api/orders/:orderId/update
@order_routes.route('<int:id>/update', methods=['PUT'])
@login_required
def update_order(id):
    data = request.json
    new_quantity = data.get('quantity')
    order_to_update = OrderItem.query.get(id)
    if not order_to_update:
        return {'message': 'Order not found'}, 404
    if order_to_update.user_id != current_user.id:
        return redirect('api/auth/unauthorized')
    # remove item if quantity <= 0
    if new_quantity <= 0:
        db.session.delete(order_to_update)
        db.session.commit()
        return {'message': 'Successfully Deleted'}, 200
    order_to_update.quantity = new_quantity
    db.session.commit()
    return order_to_update.to_dict(), 200


# delete an order
# /api/orders/:orderId/delete
@order_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_order(id):
    order = OrderItem.query.get(id)
    if not order:
        return {'message': 'Order not found'}, 404
    if order.user_id != current_user.id:
        return redirect('api/auth/unauthorized')
    db.session.delete(order)
    db.session.commit()
    return {'message': 'Successfully Deleted'}, 200


# delete all the orders related to current user
# api/orders/current/clear
@order_routes.route('/current/clear', methods=['DELETE'])
@login_required
def clear_cart():
    cart_items = OrderItem.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        return {'message': 'There is nothing in your cart'}, 400
    for order in cart_items:
        db.session.delete(order)
    db.session.commit()
    return {'message': 'Successfully clear the cart'}, 200

