from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Stock
import pandas as pd
import yfinance as yf
import datetime as dt
from sqlalchemy import and_
import numpy as np
import logging

stock_routes = Blueprint('stocks', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# get one specific stock
# /api/stocks/<symbol>
@stock_routes.route('/<symbol>')
@login_required
def getOneStock(symbol):
    try:
        stock = yf.Ticker(symbol)
        stock_info = stock.info
        if not stock_info:
            return jsonify({"error": "Stock not found"}), 404
        
        # Fetch stock history
        periods = ["max", "30y", "20y", "10y", "5y", "1y"]
        history = pd.DataFrame()
        years_of_history = 0

        for period in periods:
            try:
                history = stock.history(period=period)
                if isinstance(history, pd.DataFrame) and not history.empty:
                    years_of_history = (history.index[-1] - history.index[0]).days / 365.25
                    break
            except Exception as e:
                logger.error(f"Error fetching {period} history for {symbol}: {str(e)}")

        if isinstance(history, pd.DataFrame) and not history.empty:
            history = history.reset_index()
            history["Date"] = history["Date"].dt.strftime("%Y-%m-%d")
            history = history.replace({np.nan: None})
            history_dict = history.to_dict(orient="records")
        else:
            history_dict = []
        
        # Get the current price
        try:
            current_price = stock.fast_info['lastPrice']
        except AttributeError:
            # If fast_info is not available, use the last closing price from info
            current_price = stock_info.get('regularMarketPrice', None)
        
        if current_price is None and history_dict:
            # If still no price, use the last closing price from history
            current_price = history_dict[-1].get('Close', None)

        # Create a dictionary to return
        stock_data = {
            "ticker": symbol,
            "name": stock_info.get("shortName", "N/A"),
            "info": stock_info,
            "history": history_dict,
            "currentPrice": current_price,
            "years_of_history": round(years_of_history, 2)
        }
        return jsonify(stock_data)
    except Exception as e:
        logger.error(f"Error fetching stock data for {symbol}: {str(e)}")
        return jsonify({"error": "Failed to fetch stock data"}), 500
