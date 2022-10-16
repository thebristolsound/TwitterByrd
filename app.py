# flask libs for api functionality
from flask import Flask, jsonify, request, abort
# flask-restful
from flask_restful import Resource, Api
# marshmallow for querystring parsing
from marshmallow import Schema, fields, ValidationError
# used to connect to Twitter APIv2
from twarc import Twarc2, ensure_flattened
# to read token for api
import os, json
# can't be too safe :-p
from markupsafe import escape
# enum
import enum

# Enum to hold map commands to valid values (plus it looks nices when referencing in code \o/)
class ValidCommands(enum.Enum):
    GRAB_USER = 'grabuser'

# iterable list of command values for easier validation
valid_commands_values = [command.value for command in ValidCommands]

# querystring parameter schema
class CommandQuerySchema(Schema):
    def validate_command(c):
        if c not in valid_commands_values:
            raise ValidationError('The Console does not compute command {}'.format(c))

    command = fields.Str(required=True, validate=validate_command, error_messages={'required': 'The Console requires a command', 'code': 400})
    username = fields.Str(required=True, error_messages={'required': 'The Console requires a target', 'code': 400})

# create app
app = Flask(__name__)
api = Api(app)
schema = CommandQuerySchema()

# load config keys
with open(os.path.expanduser('~/.twitter_config'), 'r') as f:
        keys = json.load(f)
# instantiate twarc2 instance
twarc = Twarc2(bearer_token=keys['Bearer_Token'])


class TheConsole(Resource):
    """ The main handler of the commands."""
    def get(self):
        try:
            # get parameters from querystring
           args = schema.load(request.args)
           command = args['command']
           username = args['username']
           # grabuser script
           if command == ValidCommands.GRAB_USER.value:
                return grab_users(username)
            #TODO implement other commands (scripts)
        except ValidationError as err:
            abort(400, err.messages)



def grab_users(username):
    """This endpoints main purpose is to mimic the grabuser script. """
    # find userid of the username
    user_id = get_user_id(username).get('id')
    # grab the account ids of the follower accounts for this user
    account_user_ids = set(get_followers_ids(user_id))
    # grab the account ids of the accounts the user if following
    account_user_ids.update(get_following_ids(user_id))
    # grab the user accounts for both following and followers
    users = get_users(account_user_ids)

    # returns a list of json user objects
    return users


def get_following_ids(user_id):
    """Grab the user_ids of the accounts the user is following"""
    account_ids = []
    # iterate over pages of accounts the user followers
    for i, following_page in enumerate(twarc.following(user_id, user_fields=['id'])):
        for following in ensure_flattened(following_page.get('data')):
            account_ids.append(following.get('id'))
        # stop for one page for testing
        break
    return account_ids
        
def get_followers_ids(user_id):
    """Grab the user_ids of the followers of given user"""
    account_ids = []
    # iterate over pages of accounts the user followers
    for i, follower_page in enumerate(twarc.followers(user_id, user_fields=['id'])):
        for follower in ensure_flattened(follower_page.get('data')):
            account_ids.append(follower.get('id'))
        # stop for one page for testing
        break
    return account_ids

def get_users(user_ids):
    users = []
    # lookup users accounts
    for i, user_page in enumerate(twarc.user_lookup(user_ids)):
        for user in ensure_flattened(user_page.get('data')):
            users.append(user)
        # stop for one page for testing
        break
    return users

def get_user_id(username):
    """Grab the user_id of the username """
    for i, user_page in enumerate(twarc.user_lookup({username}, usernames=True)):
        return ensure_flattened(user_page.get('data'))[0]

# driver function
if __name__ == '__main__':
    api.add_resource(TheConsole, '/TheConsole')
    app.run(debug=True)