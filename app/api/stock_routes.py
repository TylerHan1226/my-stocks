from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Stock
import pandas as pd
import yfinance as yf
import datetime as dt
from sqlalchemy import and_

stock_routes = Blueprint('stocks', __name__)

# get one specific stock
@stock_routes.route('/<symbol>')
@login_required
def getOneStock(symbol):
    """
    Get Details for a Specific Stock
    """
    stock = yf.Ticker(symbol)
    stock_info = stock.info
    if not stock_info:
        return jsonify({"error": "Stock not found"}), 404
    try:
        # Fetch stock history
        history = stock.history(period="10y").reset_index()
        history["Date"] = history["Date"].dt.strftime("%Y-%m-%d")
        # Create a dictionary to return
        stock_data = {
            "ticker": symbol,
            "name": stock_info.get("shortName", "N/A"),
            "info": stock_info,
            "history": history.to_dict(orient="records"),
        }
        return jsonify(stock_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# get all stocks
@stock_routes.route("/all")
@login_required
def getAllStock():
    """
    Get All Stocks
    """
    stocks = Stock.query.all()
    return jsonify([stock.to_dict() for stock in stocks])
