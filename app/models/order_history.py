from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class OrderHistory(db.Model):
    __tablename__ = 'order_histories'

    if environment == 'production':
        __table_args__={'schema': SCHEMA}
    
    id = Column(Integer, primary_key=True)
    # order_id = Column(Integer, ForeignKey(add_prefix_for_prod('order_items.id')), nullable=False)
    instrument_id = Column(Integer, ForeignKey(add_prefix_for_prod('instruments.id')), nullable=False)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')))
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)


    users = relationship('User', back_populates='order_histories')
    # order_items = relationship('OrderItem', back_populates='order_histories')
    instruments = relationship('Instrument', back_populates='order_histories')


    def to_dict(self):
        return {
            'id': self.id,
            'instrument_id': self.instrument_id,
            'user_id': self.user_id,
            'quantity': self.quantity,
            'created_at': str(self.created_at.strftime("%Y-%m-%d %H:%M:%S")),
        }