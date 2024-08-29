from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import MyList
# import pandas as pd
# import yfinance as yf
# import datetime as dt
# from sqlalchemy import and_
# import numpy as np

list_routes = Blueprint('lists', __name__)

# get one specific stock
# /api/lists
@list_routes.route('/')
@login_required
def get_all_my_lists():
    # """
    # Get All the lists under the user
    # """
    my_lists = MyList.query.filter_by(user_id=current_user.id).all()
    my_lists_list = [my_list.to_dict() for my_list in my_lists]
    return {'My_Lists': my_lists_list}, 200
