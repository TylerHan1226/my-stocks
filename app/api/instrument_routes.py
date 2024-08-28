from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import db, Instrument
from app.forms import InstrumentForm
from .aws_helper import get_unique_filename, upload_file_to_s3
from sqlalchemy import or_
import json

instrument_routes = Blueprint('instruments', __name__)

# get all instruments
# /api/instruments
@instrument_routes.route('/')
def all_instruments():
    instruments = Instrument.query.all()
    instrument_list = [instrument.to_dict() for instrument in instruments]
    return {'Instruments': instrument_list}, 200


# get the instrument by id
# /api/instruments/:instrumentId
@instrument_routes.route('/<int:id>')
def instrument(id):
    instrument = Instrument.query.get(id)
    if not instrument:
        return {'message': 'Instrument not found'}, 404
    else:
        instrument_list = instrument.to_dict()
        return instrument_list, 200

# get instruments by search
# /api/instruments/search/searchInput
@instrument_routes.route('/search/<searchInput>')
def instruments_by_name(searchInput):
    instruments = Instrument.query.filter(
        or_(
            Instrument.model.ilike(f'%{searchInput}%'),
            Instrument.make.ilike(f'%{searchInput}%'),
            Instrument.category.ilike(f'%{searchInput}%'),
            Instrument.color.ilike(f'%{searchInput}%')
        )
    ).all()
    if not instruments:
        return {'message': 'Cannot get instruments by name'}
    else:
        instrument_list = [instrument.to_dict() for instrument in instruments]
        return {'SelectedInstruments': instrument_list}


# create an instrument
# /api/instruments/new
@instrument_routes.route('/new', methods=['GET', 'POST'])
@login_required
def create_instrument():
    form = InstrumentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # image = form.data['image_url']
        image = request.files['image_url']

        url = None
        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            if 'url' not in upload:
                return {'message': 'Failed to upload image'}, 500
            url = upload['url']

        new_instrument = Instrument(
            seller_id = current_user.id,
            make = form.make.data,
            model = form.model.data,
            color = form.color.data,
            category = form.category.data,
            price = form.price.data,
            details = form.details.data,
            body = form.body.data,
            fretboard = form.fretboard.data,
            is_used = form.is_used.data,
            image_url=url,
            discount = form.body.discount,
        )
        # explicitly load
        # form.populate_obj(new_instrument)

        print('form.is_used.data in route ==>', form.is_used.data)

        db.session.add(new_instrument)
        db.session.commit()
        return new_instrument.to_dict(), 201
    return form.errors, 400



# update an instrument
# /api/instruments/:instrumentId/update
@instrument_routes.route('/<int:id>/update', methods=['PUT'])
@login_required
def update_instrument(id):
    form = InstrumentForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        instrument = Instrument.query.get(id)
        if not instrument:
            return {'message': 'Instrument not found'}, 404
        if instrument.seller_id != current_user.id:
            return redirect('api/auth/unauthorized')

        image = form.image_url.data
        url = None
        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            if 'url' not in upload:
                return {'message': 'Failed to upload image'}, 500
            url = upload['url']
        else:
            url = instrument.image_url
        
        instrument.make = form.make.data
        instrument.model = form.model.data
        instrument.color = form.color.data
        instrument.category = form.category.data
        instrument.price = form.price.data
        instrument.details = form.details.data
        instrument.body = form.body.data
        instrument.fretboard = form.fretboard.data
        instrument.is_used = form.is_used.data
        instrument.image_url = url
        instrument.discount = form.discount.data

        # form.populate_obj(instrument)
        db.session.commit()
        return instrument.to_dict(), 200
    return form.errors, 400


# delete an instrument
# /api/instruments/delete
@instrument_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_instrument(id):
    instrument = Instrument.query.get(id)
    if not instrument:
        return {'message': 'Instrument not found'}, 404
    if instrument.seller_id != current_user.id:
        return redirect('api/auth/unauthorized')
    db.session.delete(instrument)
    db.session.commit()
    return {'message': 'Successfully Deleted'}, 200

