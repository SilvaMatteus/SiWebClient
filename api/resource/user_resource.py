#-*- encoding: utf-8 -*-

from flask import Blueprint, request
from repository.user_repository import UserRepository
from shared.utils import default_parser

from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

import simplejson as json
''' This class recive http requests from web clients to retrive, save and update data
'''

user_repository = UserRepository()

user_blueprint = Blueprint('user_blueprint', __name__)

def check_token(token):
    return user_repository.checkAuth(token)

@user_blueprint.route("/users/<string:token>", methods=['GET'])
def list(token):
    '''Get a list of all users
    '''
    if not check_token(token):
        return 'Invalid token', 400

    try:
        return json.dumps(user_repository.list(), default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 400

#@user_blueprint.route("/user/<string:id>/<string:token>", methods=['GET'])
#def get(id, token):
 #   '''Get a specific user
  #  '''

#    if not check_token(token):
 #       return 'Invalid token', 400

  #  try:
   #     user = user_repository.get(id)
    #    return json.dumps(user, default=default_parser), 200
   # except Exception as e:
    #    return '%s' % (e), 400

@user_blueprint.route("/list-emails/<string:token>", methods=['GET'])
def get_registered_emails(token):
    ''' Return a list of users emails
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        list_of_emails = user_repository.get_all_emails()
        return json.dumps(list_of_emails, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 400

@user_blueprint.route("/email/<string:id>/<string:token>", methods=['GET'])
def get_email_id(id, token):
    '''Get email of a specific user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        email = user_repository.get_email(id)
        return json.dumps(email, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 400

@user_blueprint.route("/user/<string:email>/<string:password>", methods=['GET'])
def autenticate(email, password):
    '''Return Ok if email and password match
    '''
    user = user_repository.autenticate(email, password)
    if user:
        return json.dumps(user, default=default_parser), 200
    else:
        return "Oh snap!", 404



@user_blueprint.route("/user", methods=['POST'])
def post():
    '''Register a user on api
    '''
    try:
        user_repository.new(
            json.loads(
                request.data.decode('utf-8')
            )
        )
        return 'User successfully registered', 201
    except Exception as e:
        return '%s' % (e), 400


@user_blueprint.route("/user/<string:token>", methods=['PUT'])
def update(token):
    '''Update user informations
    '''

    if not check_token(token):
        return 'Invalid token', 400

    user_repository.update(
        json.loads(
            request.data.decode('utf-8')
        )
    )
    return "User successfully updated", 200


@user_blueprint.route("/user/<string:id>/<string:token>", methods=['DELETE'])
def delete(id, token):
    '''Let the clients delete a user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        user_repository.delete(id)
        return 'User successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 400

# Documents and folders!

@user_blueprint.route("/document/<string:user_id>/<string:folder_id>/<string:token>", methods=['POST'])
def new_document(user_id, folder_id, token):
    '''Let the clients create a document to an user saved documents
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.new_document(**kwargs)
        return 'Document successfully created', 201
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/document/<string:user_id>/<string:token>", methods=['DELETE'])
def delete_document(user_id, token):
    ''' Let the clients delete a documet from an user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.delete_document(**kwargs)
        return 'Document successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/document/<string:user_id>/<string:token>", methods=['PUT'])
def edit_document(user_id, token):
    ''' Edit a user document, update the document content
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.edit_document(**kwargs)

        return 'Document successfully edited', 202
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/share/edit/<string:token>", methods=['PUT'])
def edit_document_shared(token):
    ''' Let the documents edit the content of a user shared document
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        print kwargs
        user_repository.edit_document_shared(**kwargs)

        return 'Document successfully edited', 202
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folders/<string:user_id>/<string:token>", methods=['GET'])
def get_folders(user_id, token):
    ''' Retrive all user folders
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        folders = user_repository.get_folders(user_id)
        return json.dumps(folders, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404



@user_blueprint.route("/folders_tree/<string:user_id>/<string:token>", methods=['GET'])
def get_folders_tree(user_id, token):
    '''Retrive all folders and documents on a node tree format to let cliets show the document in a more friendly way
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        folders = [user_repository.get_folders_tree(user_id)]
        return json.dumps(folders, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folder/<string:user_id>/<string:token>", methods=['POST'])
def new_folder(user_id, token):
    ''' Create a folder to a user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.new_folder(**kwargs)
        return "Folder created sucessfully"
    except Exception as e:
        return "%s" % (e), 404

@user_blueprint.route("/folder/<string:user_id>/<string:folder_id>/<string:token>", methods=['PUT'])
def rename_Folder(user_id, folder_id, token):
    '''Rename a folder from user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.rename_Folder(**kwargs)
        return 'Folder successfully renamed', 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folder/<string:user_id>/<string:folder_id>/<string:token>", methods=['DELETE'])
def delete_folder(user_id, folder_id, token):
    ''' Let the clients delete an user folder
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = {}
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.delete_folder(**kwargs)
        return 'Folder successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 404


@user_blueprint.route("/share/<string:user_id>/<string:document_id>/<string:token>", methods=['PUT'])
def share_document(user_id, document_id, token):
    '''Share a document from an user with other user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        kwargs['document_id'] = document_id
        user_repository.share_document(**kwargs)
        return 'Document successfully shared', 200
        #return "OK", 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/share/<string:user_id>/<string:token>", methods=['GET'])
def get_shared_documents(user_id, token):
    ''' Retrive all documets shareds with an user
    '''

    if not check_token(token):
        return 'Invalid token', 400

    try:
        shared_documents = user_repository.get_shared_with_me_documents(user_id)
        return json.dumps(shared_documents, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404
