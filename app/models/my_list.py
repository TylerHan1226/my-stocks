from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class MyList(db.Model):
    __tablename__ = "my_lists"

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    list_name = Column(String(50), nullable=False)
    stock_symbol = Column(String(10), nullable=False)
    historical_dividend = Column(Integer, nullable=True)
    performance_change = Column(Integer, nullable=True)
    screener_period = Column(String(25), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)

    users = relationship('User', back_populates='my_lists')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'list_name': self.list_name,
            'stock_symbol': self.stock_symbol,
            'historical_dividend': self.historical_dividend,
            'performance_change': self.performance_change,
            'screener_period': self.screener_period,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }