from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
import json, requests
import yfinance as yf
import datetime as dt

news_routes = Blueprint('news', __name__)

# /api/news/market
@news_routes.route('/market')
def all_news():
    market_symbols = ["^GSPC", "^IXIC", "^DJI", "^RUT"]
    response = {}
    for market in market_symbols:
        res = yf.Ticker(market)
        for article in res.news:
            if article["publisher"] in ["Motley Fool", "Insider Monkey"]:
                continue
            formatted_article = {}
            formatted_article["title"] = article["title"]
            formatted_article["publisher"] = article["publisher"]
            formatted_article["link"] = article["link"]
            formatted_article["date"] = dt.datetime.fromtimestamp(article["providerPublishTime"]).strftime("%Y-%m-%dT%H:%M:%SZ")
            try:
                formatted_article["url"] = article["thumbnail"]["resolutions"][1]["url"]
            except:
                formatted_article["url"] = None
            response[article["uuid"]] = formatted_article
    return jsonify(list(response.values()))
