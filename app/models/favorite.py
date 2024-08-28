from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Favorite(db.Model):
    __tablename__ = 'favorites'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}
    
    id = Column(Integer, primary_key=True)
    instrument_id = Column(Integer, ForeignKey(add_prefix_for_prod('instruments.id')), nullable=False)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    users = relationship('User', back_populates='favorites')
    instruments = relationship('Instrument', back_populates='favorites')

    def to_dict(self):
        return {
            'id': self.id,
            'instrument_id': self.instrument_id,
            'user_id': self.user_id,
            'created_at': self.created_at
        }