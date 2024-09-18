from flask.cli import AppGroup
from .users import seed_users, undo_users
from .my_lists import seed_my_lists, undo_my_lists

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
        undo_my_lists()
        undo_users()
    seed_users()
    seed_my_lists()
    # seed_stocks()

# pipenv shell flask seed undo
@seed_commands.command('undo')
def undo():
    undo_my_lists()
    undo_users()
    # Add other undo functions here
