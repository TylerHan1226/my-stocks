from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
import json, requests
import yfinance as yf
import datetime as dt

news_routes = Blueprint('news', __name__)

# /api/news/market
@news_routes.route('/market')
def market_news():
    market_symbols = ["^GSPC", "^IXIC", "^DJI", "^RUT"]
    articles = []
    seen_titles = set()
    for market in market_symbols:
        res = yf.Ticker(market)
        for article in res.news:
            if article["publisher"] in ["Motley Fool", "Insider Monkey"]:
                continue
            if article["title"] in seen_titles:
                continue
            seen_titles.add(article["title"])
            formatted_article = {}
            formatted_article["title"] = article["title"]
            formatted_article["publisher"] = article["publisher"]
            formatted_article["link"] = article["link"]
            formatted_article["date"] = dt.datetime.fromtimestamp(article["providerPublishTime"]).strftime("%Y-%m-%dT%H:%M:%SZ")
            try:
                formatted_article["image_url"] = article["thumbnail"]["resolutions"][1]["url"]
            except:
                formatted_article["image_url"] = None
            formatted_article["publish_time"] = article["providerPublishTime"]
            articles.append(formatted_article)
    
    # Sort articles by publish time in descending order and get the latest 10
    latest_articles = sorted(articles, key=lambda x: x["publish_time"], reverse=True)[:10]
    
    return jsonify(latest_articles)

