from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    instrument_id = Column(Integer, ForeignKey(add_prefix_for_prod('instruments.id')), nullable=False)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    users = relationship('User', back_populates='order_items')
    instruments = relationship('Instrument', back_populates='order_items')
    # order_histories = relationship('OrderHistory', back_populates='order_items')


    def to_dict(self):
        return {
            'id': self.id,
            'instrument_id': self.instrument_id,
            'user_id': self.user_id,
            'quantity': self.quantity,
            'created_at': str(self.created_at.strftime("%Y-%m-%d %H:%M:%S")),
        }
