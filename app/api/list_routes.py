from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.forms import ListForm
from app.models import db, MyList


list_routes = Blueprint('lists', __name__)

# get all user lists
# /api/lists
@list_routes.route('/')
@login_required
def get_all_my_lists():
    my_lists = MyList.query.filter_by(user_id=current_user.id).all()
    my_lists_list = [my_list.to_dict() for my_list in my_lists]
    return {'My_Lists': my_lists_list}, 200

# add new list
# /api/lists/new
@list_routes.route('/new', methods=['POST'])
@login_required
def add_new_list():
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_list = MyList (
            user_id = current_user.id,
            list_name = form.list_name.data,
            stock_symbol = form.stock_symbol.data,
        )
    
        db.session.add(new_list)
        db.session.commit()
        return new_list.to_dict(), 201
    return form.errors, 400

# update a list
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

# remove a list
# /api/lists/remove
@list_routes.route('/<int:id>/remove', methods=['DELETE'])
@login_required
def remove_list(id):
    list = MyList.query.get(id)
    if not list:
        return {'message': 'List not found'}, 404
    if list.user_id != current_user.id:
        return redirect('api/auth/unauthorized')
    db.session.delete(list)
    db.session.commit()
    return {'message': 'Successfully Deleted'}, 200
