from app.models import db, MyList, environment, SCHEMA
from sqlalchemy.sql import text
import json

def seed_my_lists():
    my_lists_1 = MyList(
        user_id = "1",
        list_name = "Tech",
        stock_symbol = "AAPL"
    )
    my_lists_2 = MyList(
        user_id = "1",
        list_name = "Tech",
        stock_symbol = "NVDA"
    )
    my_lists_3 = MyList(
        user_id = "1",
        list_name = "Tech",
        stock_symbol = "GOOGL"
    )
    my_lists_4 = MyList(
        user_id = "1",
        list_name = "Tech",
        stock_symbol = "MU"
    )
    my_lists_5 = MyList(
        user_id = "1",
        list_name = "Tech",
        stock_symbol = "TSM"
    )
    my_lists_6 = MyList(
        user_id = "1",
        list_name = "ETF",
        stock_symbol = "SPY"
    )
    my_lists_7 = MyList(
        user_id = "1",
        list_name = "ETF",
        stock_symbol = "QQQ"
    )
    my_lists_8 = MyList(
        user_id = "1",
        list_name = "ETF",
        stock_symbol = "SMH"
    )
    my_lists_9 = MyList(
        user_id = "1",
        list_name = "ETF",
        stock_symbol = "VGT"
    )
    my_lists_10 = MyList(
        user_id = "1",
        list_name = "Industrial",
        stock_symbol = "WM"
    )

    db.session.add_all([my_lists_1,
                        my_lists_2,
                        my_lists_3,
                        my_lists_4,
                        my_lists_5,
                        my_lists_6,
                        my_lists_7,
                        my_lists_8,
                        my_lists_9,
                        my_lists_10,
                        ])
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_my_lists():
   if environment == "production":
       db.session.execute(f"TRUNCATE table {SCHEMA}.my_lists RESTART IDENTITY CASCADE;")
   else:
       db.session.execute(text("DELETE FROM my_lists"))

   db.session.commit()