from flask_wtf import FlaskForm
# from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, DecimalField
from wtforms.validators import DataRequired, ValidationError
from ..models import MyList

# form class
class ListForm(FlaskForm):
    list_name = StringField('List_name')
    stock_symbol = StringField('Stock_symbol')
    historical_dividend = DecimalField('Historical_dividend')
    performance_change = StringField('Performance_change')
    screener_period = StringField('Screener_period')