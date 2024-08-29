from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import db, MyList
from sqlalchemy import or_
import json

list_routes = Blueprint('my_lists', __name__)

# get all instruments
# /api/my_lists
@list_routes.route('/')
@login_required
def all_my_lists():
    my_lists = MyList.query.filter_by(user_id=current_user.id).all()
    my_lists_list = [my_list.to_dict() for my_list in my_lists]
    return {'My_Lists': my_lists_list}, 200