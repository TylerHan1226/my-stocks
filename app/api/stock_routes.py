from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Stock
import pandas as pd
import yfinance as yf
import datetime as dt
from sqlalchemy import and_

stock_routes = Blueprint('stocks', __name__)

# get one specific stock
@stock_routes.route('/<ticker>')
@login_required
def getOneStock(ticker):
    """
    Get Details for a Specific Stock
    """
    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404
    return jsonify(stock.full_details())


# get all stocks
@stock_routes.route("/all")
@login_required
def getAllStock():
    """
    Get All Stocks
    """
    stocks = Stock.query.all()
    return jsonify([stock.to_dict() for stock in stocks])
