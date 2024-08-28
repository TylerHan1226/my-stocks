from app.models import db, OrderHistory, environment, SCHEMA
from sqlalchemy.sql import text
import json


def seed_order_histories():
    oh_1 = OrderHistory(
        instrument_id = 5,
        user_id = "1",
        quantity = 1,
        # created_at = 
    )
    oh_2 = OrderHistory(
        instrument_id = 8,
        user_id = "1",
        quantity = 1,
    )
    oh_3 = OrderHistory(
        instrument_id = 13,
        user_id = "1",
        quantity = 1,
    )

    db.session.add_all([oh_1, oh_2, oh_3])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_order_histories():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.order_histories RESTART IDENTITY CASCADE;")
    else:
       db.session.execute(text("DELETE FROM order_histories"))
    db.session.commit()