from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from ..models import MyList

# helper validators
def check_under_50(field_name):
    def _check(form, field):
        if len(field.data) >= 50:
            raise ValidationError(f"{field_name} must be under 50 characters")
    return _check

def check_under_10(field_name):
    def _check(form, field):
        if len(field.data) >= 10:
            raise ValidationError(f"{field_name} must be under 50 characters")
    return _check

# form class
class ListForm(FlaskForm):
    list_name = StringField('List_name', validators=[DataRequired(), check_under_50('List_name')])
    stock_symbol = StringField('Stock_symbol', validators=[DataRequired(), check_under_10('Stock_symbol')])
    