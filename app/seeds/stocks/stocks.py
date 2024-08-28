from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
import yfinance as yf
import pandas as pd
import json


# Adds a demo user, you can add other stocks here if you want
def seed_stocks():
    data = pd.read_csv("app/seeds/stocks/sp-500-index-03-26-2024.csv")
    tickers = data.loc[:,"Symbol"].to_list()
    stocks = yf.Tickers(" ".join(tickers))
    for ticker in tickers:
        try:
            info = stocks.tickers[ticker].info
            history = stocks.tickers[ticker].history(period="10y").reset_index()
            history["Date"] = history["Date"].dt.strftime("%Y-%m-%d")
            dbinstance = Stock(ticker=ticker, name=info["shortName"], info=info, history=history)
            db.session.add(dbinstance)
            db.session.commit()
        except:
            continue


# Uses a raw SQL query to TRUNCATE or DELETE the stocks table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
