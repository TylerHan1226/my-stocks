from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import db, Favorite, Instrument
import json

favorite_routes = Blueprint('favorite', __name__)


# get all favorites under the current user
# /api/favorites/current
@favorite_routes.route('/current')
@login_required
def fav_by_user():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    favorites_list = [fav.to_dict() for fav in favorites]

    instrument_id_list = [favorite["instrument_id"] for favorite in favorites_list]
    instruments = Instrument.query.filter(Instrument.id.in_(instrument_id_list)).all()
    instrument_list = [instrument.to_dict() for instrument in instruments]

    return {'MyFavorites': favorites_list, 'FavInst': instrument_list}, 200


# add to favorites
# /api/favorites/new
@favorite_routes.route('/new', methods=['POST'])
@login_required
def add_fav():
    data = request.json
    instrument_id = data.get('instrument_id')
    new_fav = Favorite(user_id=current_user.id, instrument_id=instrument_id)
    if not new_fav:
        return {'message': 'Cannot Add to favorites'}, 400
    db.session.add(new_fav)
    db.session.commit()
    return {'message': 'Added to favorites'}, 200

# delete a favorites
# /api/favorites/:favoriteId/delete
@favorite_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def remove_fav(id):
    favorite = Favorite.query.get(id)
    if not favorite:
        return {'message': 'Favorite item is not found'}, 404
    if favorite.user_id != current_user.id:
        return redirect('api/auth/unauthorized')
    db.session.delete(favorite)
    db.session.commit()
    return {'message': 'Successfully Deleted'}, 200

