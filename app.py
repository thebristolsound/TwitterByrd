# flask libs for api functionality
from flask import Flask, jsonify, request, abort
from flask_cors import CORS

# flask-res0tful
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
#import the pandas library and aliasing as pd
import pandas as pd

# Enum to hold map commands to valid values (plus it looks nices when referencing in code \o/)
class ValidCommands(enum.Enum):
    GRAB_USER = 'grabuser'
    JSON_SAME = 'jsonsame'
    GET_FOLLOWERS = 'get-followers'
    GET_FOLLOWING = 'get-following'
    GET_MUTUALS = 'get-mutuals'

# iterable list of command values for easier validation
valid_commands_values = [command.value for command in ValidCommands]

# querystring parameter schema
class CommandQuerySchema(Schema):
    def validate_command(c):
        if c not in valid_commands_values:
            raise ValidationError('The Console does not compute command {}'.format(c))
    
    command = fields.Str(required=True, validate=validate_command, error_messages={'required': 'The Console requires a command', 'code': 400})
    username = fields.Str(required=True, error_messages={'required': 'The Console requires a target', 'code': 400})
    comparison_username = fields.Str()

# create app
app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
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
           elif command == ValidCommands.JSON_SAME.value:
                if args.get('comparison_username') is None:
                    abort(400, "The Console requires a comparison username to perform a comparison command")    
                comparison_username = args['comparison_username']
                return json_same(username, comparison_username) 
           elif command == ValidCommands.GET_FOLLOWERS.value:
               return get_followers(username)
           elif command == ValidCommands.GET_FOLLOWING.value:
               return get_following(username)
           elif command == ValidCommands.GET_MUTUALS.value:
               return get_mutuals(username)
           else:
                abort(400, "The Console rejects your query")
            #TODO implement other commands (scripts)
        except ValidationError as err:
            abort(400, err.messages)


def json_same(primary_username, comparison_username):
    """This functions main purpose is to mimic the jsonsame script. """
    similiar_accounts = []
    # grab followers and followings account ids for primary user
    primary_users = grab_users(primary_username)
    # grab followers and followings account ids for comparison user
    comparison_users = grab_users(comparison_username)
    # extract the id from the primary users followers/following accounts
    primary_ids = []
    for account in primary_users:
        primary_ids.append(account['id'])
    
    # check for matching id from primary account against the comparision users accounts
    for account in comparison_users:
        if account['id'] in primary_ids:
            similiar_accounts.append(account)
    
    return similiar_accounts

def grab_users(username):
    """This functions main purpose is to mimic the grabuser script. """
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

def get_followers(username): 
    """Grab all users following given username"""
    # find userid of the username
    user_id = get_user_id(username).get('id')
     # grab the account ids of the accounts that follow the user
    account_user_ids = get_followers_ids(user_id)
    # grab the user accounts for followers
    followers = get_users(account_user_ids)

    #returns a list of json user objects
    return followers

def get_following(username): 
    """Grab all users following given username"""
    # find userid of the username
    user_id = get_user_id(username).get('id')
     # grab the account ids of the accounts that follow the user
    account_user_ids = get_following_ids(user_id)
    # grab the user accounts for followers
    following = get_users(account_user_ids)

    #returns a list of json user objects
    return following

def get_mutuals(username):
    """Grab all users the given user is following that are also following them back"""
    user_id = get_user_id(username).get('id')
    # grab the account ids of the accounts that follow the user
    followers = get_followers_ids(user_id)
    # grab the account ids of the aaccounts the user is following
    following = get_following_ids(user_id)
    #  get the intersection of the two sets
    mutual_ids = {id for id in followers if id in following}
    # get the user accounts for the mutuals
    mutuals = get_users(mutual_ids)

     #returns a list of json user objects
    return mutuals
    

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
    api.add_resource(TheConsole, '/api/theconsole', endpoint='theconsole', methods=['GET'])
    app.run(debug=True)