from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, DecimalField, BooleanField
from wtforms.validators import DataRequired, ValidationError
from ..api.aws_helper import ALLOWED_EXTENSIONS
from ..models import Instrument


# helper validators
def check_under_100(field_name):
    def _check(form, field):
        if len(field.data) >= 100:
            raise ValidationError(f"{field_name} must be under 100 characters")
    return _check


def check_category(form, field):
    valid_categories = ['Electric Guitar', 'Acoustic Guitar', 'Bass']
    if field.data not in valid_categories:
        raise ValidationError('Category must be one of the following: Electric Guitar, Acoustic Guitar, Bass')


def check_price(form, field):
    if field.data <= 0:
        raise ValidationError('Price must be greater than 0')


def check_details(form, field):
    if len(field.data) <= 25:
        raise ValidationError('Details must be greater than 25 characters')

def check_discount(form, field):
    if not (0 <= field.data <= 1):
        raise ValidationError('Discount must be between 0 and 1')


# form class
class InstrumentForm(FlaskForm):
    make = StringField('Make', validators=[DataRequired(), check_under_100('Make')])
    model = StringField('Model', validators=[DataRequired(), check_under_100('Model')])
    color = StringField('Color', validators=[DataRequired(), check_under_100('Color')])
    category = StringField('Category', validators=[DataRequired(), check_category])
    price = DecimalField('Price', validators=[DataRequired(), check_price])
    details = StringField('Details', validators=[DataRequired(), check_details])
    body = StringField('Body', validators=[DataRequired(), check_under_100('Body')])
    fretboard = StringField('Fretboard', validators=[DataRequired(), check_under_100('Fretboard')])
    is_used = BooleanField('Pre-owned')
    discount = DecimalField('Discount', validators=[check_discount])
    image_url = FileField('Image File', validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    