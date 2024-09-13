from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.forms import ListForm
from app.models import db, MyList
import yfinance as yf
import numpy as np


list_routes = Blueprint('lists', __name__)

# get all user lists
# /api/lists
@list_routes.route('/')
@login_required
def get_all_my_lists():
    my_lists = MyList.query.filter_by(user_id=current_user.id).all()
    if not my_lists:
        return jsonify({"error": "Cannot fetch list"})
    my_lists_list = [my_list.to_dict() for my_list in my_lists]
    return {'My_Lists': my_lists_list}, 200

# Get all stocks in a specific list
# /api/lists/<int:list_name>/stocks
@list_routes.route('/<string:list_name>/stocks', methods=['GET'])
# @list_routes.route('/stocks', methods=['GET'])
@login_required
def get_all_stocks_for_user(list_name):
    # Fetch all lists for the current user
    my_lists = MyList.query.filter_by(user_id=current_user.id, list_name=list_name).all()
    
    if not my_lists:
        return jsonify({"error": "No lists found for the current user"}), 404

    stocks_data = {}
    symbols = [my_list.stock_symbol for my_list in my_lists]

    for eachSymbol in symbols:
        stock = yf.Ticker(eachSymbol)
        stock_info = stock.info
            
        if not stock_info:
            stocks_data[eachSymbol] = {"error": "Stock not found"}
            continue
        
        # Get the current price
        try:
            current_price = stock.fast_info['lastPrice']
        except AttributeError:
            # If fast_info is not available, use the last closing price from info
            current_price = stock_info.get('regularMarketPrice', None)


        stock_data = {
            "ticker": eachSymbol,
            "name": stock_info.get("shortName", "N/A"),
            "info": stock_info,
            "current_price": current_price

        }
        stocks_data[eachSymbol] = stock_data

    return jsonify({
        "user_id": current_user.id,
        "stocks_data": stocks_data
    })


# Get all stocks of all lists
# /api/lists/all-stocks
@list_routes.route('/all-stocks', methods=['GET'])
@login_required
def get_all_stocks_of_all_lists():
    # Fetch all lists for the current user
    my_lists = MyList.query.filter_by(user_id=current_user.id).all()
    
    if not my_lists:
        return jsonify({"error": "No lists found for the current user"}), 404

    stocks_data = {}
    symbols = [my_list.stock_symbol for my_list in my_lists]

    for eachSymbol in symbols:
        stock = yf.Ticker(eachSymbol)
        stock_info = stock.info
            
        if not stock_info:
            stocks_data[eachSymbol] = {"error": "Stock not found"}
            continue
        
        # Get the current price
        try:
            current_price = stock.fast_info['lastPrice']
        except AttributeError:
            # If fast_info is not available, use the last closing price from info
            current_price = stock_info.get('regularMarketPrice', None)

        stock_data = {
            "ticker": eachSymbol,
            "name": stock_info.get("shortName", "N/A"),
            "open": stock_info.get("open", "N/A"),
            "current_price": current_price
        }
        stocks_data[eachSymbol] = stock_data

    return jsonify({
        "user_id": current_user.id,
        "stocks_data": stocks_data
    })

# add new list
# /api/lists/new
@list_routes.route('/new', methods=['POST'])
@login_required
def add_new_list():
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Check if the stock symbol is valid
        stock_symbol = form.stock_symbol.data
        stock = yf.Ticker(stock_symbol)
        
        try:
            # Try to get some basic info about the stock
            stock_info = stock.info
            if not stock_info or 'symbol' not in stock_info:
                return jsonify({"error": f"Invalid stock symbol: {stock_symbol}"}), 400
        except Exception as e:
            return jsonify({"error": f"Error validating stock symbol: {str(e)}"}), 400

        new_list = MyList(
            user_id=current_user.id,
            list_name=form.list_name.data,
            stock_symbol=stock_symbol,
        )
    
        db.session.add(new_list)
        db.session.commit()
        return new_list.to_dict(), 201
    return form.errors, 400

# update a list
# /api/lists/<int:id>/update
@list_routes.route('/<int:id>/update', methods=['PUT'])
@login_required
def update_list(id):
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        list = MyList.query.get(id)
        if not list:
            return {'message': 'List not found'}, 404
        if list.user_id != current_user.id:
            return redirect('api/auth/unauthorized')
        list.list_name = form.list_name.data
        list.stock_symbol = form.stock_symbol.data
        db.session.commit()
        return list.to_dict(), 200
    return form.errors, 400

# update all lists under list name
# /api/lists/<string:list_name>/edit-name
@list_routes.route('/<string:list_name>/edit-name', methods=['PUT'])
@login_required
def edit_list_name(list_name):
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        selected_lists = MyList.query.filter_by(user_id=current_user.id, list_name=list_name).all()
        if not selected_lists:
            return jsonify({"error": "No lists found for the current user"}), 404
        for selected_list in selected_lists:
            selected_list.list_name = form.list_name.data
            db.session.commit()
        return [selected_list.to_dict() for selected_list in selected_lists], 200
    return form.errors, 400

# remove a list
# /api/lists/remove
@list_routes.route('/<int:id>/remove', methods=['DELETE'])
@login_required
def remove_stock(id):
    list = MyList.query.get(id)
    if not list:
        return {'message': 'List not found'}, 404
    if list.user_id != current_user.id:
        return redirect('api/auth/unauthorized')
    db.session.delete(list)
    db.session.commit()
    return {'message': 'Successfully Deleted'}, 200

@list_routes.route('remove-list/<string:list_name>', methods=['DELETE'])
@login_required
def remove_list(list_name):
    lists_to_remove = MyList.query.filter_by(list_name=list_name).all()
    if not lists_to_remove:
        return jsonify({"error": "No lists found under this list name"}), 404
    for list in lists_to_remove:
        if list.user_id != current_user.id:
            return redirect('api/auth/unauthorized')
        db.session.delete(list)
    db.session.commit()
    return {'message': 'Successfully Deleted List'}, 200
