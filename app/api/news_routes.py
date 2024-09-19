from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
import json, requests

news_routes = Blueprint('news', __name__)

# get market news
# /api/news/market
@news_routes.route('/market')
def all_news():
    api_key = "4780de20273648b0b968dbc62a48cc20"
    url = "https://newsapi.org/v2/everything"
    # ?q=yahoo%20finance&language=en&sortBy=publishedAt&apiKey=4780de20273648b0b968dbc62a48cc20
    params = {
        "q": 'yahoo finance',
        'language': 'en',
        'sortBy': 'publishedAt',
        'apiKey': api_key,
        'pageSize': 30
    }
    response = requests.get(url, params=params)
    data = response.json()['articles']
    filtered_data = [article for article in data if article['title'] != '[Removed]' and article['urlToImage'] is not None and len(article['urlToImage']) != 0 and 'biztoc.com' not in article['url']]

    return jsonify(filtered_data), 200


