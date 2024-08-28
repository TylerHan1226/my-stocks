from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class Instrument(db.Model):
    __tablename__ = 'instruments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    color = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    details = Column(String(1000), nullable=False)
    body = Column(String(100), nullable=False)
    fretboard = Column(String(100), nullable=False)
    is_used = Column(Boolean, nullable=False)
    discount = Column(Float, nullable=True)
    image_url = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)


    users = relationship('User', back_populates='instruments')
    order_items = relationship('OrderItem', back_populates='instruments')
    order_histories = relationship('OrderHistory', back_populates='instruments')
    favorites = relationship('Favorite', back_populates='instruments')


    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'make': self.make,
            'model': self.model,
            'color': self.color,
            'category': self.category,
            'price': self.price,
            'details': self.details,
            'body': self.body,
            'fretboard': self.fretboard,
            'is_used': self.is_used,
            'discount': self.discount,
            'image_url': self.image_url,
        }
