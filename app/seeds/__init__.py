from flask.cli import AppGroup
from .users import seed_users, undo_users
from .instruments import seed_instruments, undo_instruments
from .order_items import seed_order_items, undo_order_items
from .order_histories import seed_order_histories, undo_order_histories
from .favorites import seed_favorites, undo_favorites

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_favorites()
        undo_order_histories()
        undo_order_items()
        undo_instruments()
        undo_users()
    seed_users()
    seed_instruments()
    seed_order_items()
    seed_order_histories()
    seed_favorites()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_favorites()
    undo_order_histories()
    undo_order_items()
    undo_instruments()
    undo_users()
    # Add other undo functions here
