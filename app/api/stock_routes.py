from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
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
    stock = yf.Ticker(symbol)
    stock_info = stock.info
    if not stock_info:
        print(f"Error: Stock info not found for {symbol}")
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
    
    # Fetch data with appropriate intervals
    historical_data_1d = stock.history(period="1d", interval="5m")['Close'].dropna().tolist()  # Hourly data for 1 day
    historical_data_1wk = stock.history(period="5d", interval="1h")['Close'].dropna().tolist()  # Daily data for 1 week
    historical_data_1mo = stock.history(period="1mo", interval="1h")['Close'].dropna().tolist()  # Daily data for 1 month
    historical_data_3mo = stock.history(period="3mo", interval="1h")['Close'].dropna().tolist()  # Daily data for 3 months
    historical_data_6mo = stock.history(period="6mo", interval="1d")['Close'].dropna().tolist()  # Daily data for 3 months
    historical_data_1yr = stock.history(period="1y", interval="1d")['Close'].dropna().tolist()  # Monthly data for 1 year
    historical_data_5yr = stock.history(period="5y", interval="5d")['Close'].dropna().tolist()  # Monthly data for 5 years
    historical_data_10yr = stock.history(period="10y", interval="5d")['Close'].dropna().tolist()  # Monthly data for 10 years
    # historical_data_ytd = stock.history(period="ytd", interval="1d")['Close'].dropna().tolist()  # Daily data for year-to-date

    # Create a dictionary to return
    stock_data = {
        "ticker": symbol,
        "name": stock_info.get("shortName", "N/A"),
        "info": stock_info,
        "history": history_dict,
        "currentPrice": current_price,
        "years_of_history": round(years_of_history, 2),
        "historical_data_1d": historical_data_1d,
        "historical_data_1wk": historical_data_1wk,
        "historical_data_1mo": historical_data_1mo,
        "historical_data_3mo": historical_data_3mo,
        "historical_data_6mo": historical_data_6mo,
        "historical_data_1yr": historical_data_1yr,
        "historical_data_5yr": historical_data_5yr,
        "historical_data_10yr": historical_data_10yr,
        # "historical_data_ytd": historical_data_ytd,
    }
    return jsonify(stock_data)



# get multiple stocks
# /api/stocks/multiple
@stock_routes.route('/multiple', methods=['POST'])
@login_required
def getMultipleStocks():
    symbols = request.json.get('symbols', [])
    if not symbols:
        return jsonify({"error": "No symbols provided"}), 400

    stocks_data = {}
    for symbol in symbols:
        stock = yf.Ticker(symbol)
        stock_info = stock.info
        if not stock_info:
            stocks_data[symbol] = {"error": "Stock not found"}
            continue

        # Get the current price
        try:
            current_price = stock.fast_info.get('lastPrice', None)
        except AttributeError:
            # If fast_info is not available, use the last closing price from info
            current_price = stock_info.get('regularMarketPrice', None)

        # Fetch historical data for 1 day
        historical_data_1d = stock.history(period="1d", interval="5m")['Close'].dropna().tolist()  # Hourly data for 1 day

        # Create a dictionary to return
        stock_data = {
            "ticker": symbol,
            "name": stock_info.get("shortName", "N/A"),
            "info": stock_info,
            "currentPrice": current_price,
            "historical_data_1d": historical_data_1d,
        }
        stocks_data[symbol] = stock_data

    return jsonify(stocks_data)


# get stocks to compare
# /api/stocks/compare
@stock_routes.route('/compare', methods=['POST'])
@login_required
def getStocksToCompare():
    symbols = request.json.get('symbols', [])
    if not symbols:
        return jsonify({"error": "No symbols provided"}), 400

    stocks_data = {}
    for symbol in symbols:
        stock = yf.Ticker(symbol)
        stock_info = stock.info
        if not stock_info:
            print(f"Error: Stock info not found for {symbol}")
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
    
        # Fetch data with appropriate intervals
        historical_data_1d = stock.history(period="1d", interval="1m")['Close'].dropna().tolist()  # Hourly data for 1 day
        historical_data_1wk = stock.history(period="5d", interval="1h")['Close'].dropna().tolist()  # Daily data for 1 week
        historical_data_1mo = stock.history(period="1mo", interval="1h")['Close'].dropna().tolist()  # Daily data for 1 month
        historical_data_3mo = stock.history(period="3mo", interval="1h")['Close'].dropna().tolist()  # Daily data for 3 months
        historical_data_6mo = stock.history(period="6mo", interval="1d")['Close'].dropna().tolist()  # Daily data for 3 months
        historical_data_1yr = stock.history(period="1y", interval="1d")['Close'].dropna().tolist()  # Monthly data for 1 year
        historical_data_5yr = stock.history(period="5y", interval="5d")['Close'].dropna().tolist()  # Monthly data for 5 years
        historical_data_10yr = stock.history(period="10y", interval="5d")['Close'].dropna().tolist()  # Monthly data for 10 years
        # historical_data_ytd = stock.history(period="ytd", interval="1d")['Close'].dropna().tolist()  # Daily data for year-to-date

        # Create a dictionary to return
        stock_data = {
            "ticker": symbol,
            "name": stock_info.get("shortName", "N/A"),
            "info": stock_info,
            "history": history_dict,
            "currentPrice": current_price,
            "years_of_history": round(years_of_history, 2),
            "historical_data_1d": historical_data_1d,
            "historical_data_1wk": historical_data_1wk,
            "historical_data_1mo": historical_data_1mo,
            "historical_data_3mo": historical_data_3mo,
            "historical_data_6mo": historical_data_6mo,
            "historical_data_1yr": historical_data_1yr,
            "historical_data_5yr": historical_data_5yr,
            "historical_data_10yr": historical_data_10yr,
            # "historical_data_ytd": historical_data_ytd,
        }
        stocks_data[symbol] = stock_data

    return jsonify(stocks_data)
