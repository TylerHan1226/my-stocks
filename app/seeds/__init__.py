from flask.cli import AppGroup
from .users import seed_users, undo_users
from .stocks.stocks import seed_stocks, undo_stocks

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# pipenv shell flask seed all
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        # undo_stocks()
        undo_users()
    seed_users()
    # seed_stocks()

# pipenv shell flask seed undo
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here

# pipenv shell flask seed stocks
@seed_commands.command('stocks')
def stock_seeder():
    if environment == 'production':
        undo_stocks()
        # undo_markets()
    seed_stocks()
    # seed_markets()

# pipenv shell flask seed undo-stocks
@seed_commands.command('undo-stocks')
def stock_unseeder():
    undo_stocks()
