#-*- encoding: utf-8 -*-

from flask import Blueprint, request
from repository.user_repository import UserRepository
from shared.utils import default_parser

import simplejson as json
''' This class recive http requests from web clients to retrive, save and update data
'''

user_repository = UserRepository()

user_blueprint = Blueprint('user_blueprint', __name__)

@user_blueprint.route("/users", methods=['GET'])
def list():
    '''Get a list of all users
    '''
    return json.dumps(user_repository.list(), default=default_parser), 200


@user_blueprint.route("/user/<string:id>", methods=['GET'])
def get(id):
    '''Get a specific user
    '''
    user = user_repository.get(id)
    return json.dumps(user, default=default_parser), 200

@user_blueprint.route("/list-emails", methods=['GET'])
def get_registered_emails():
    ''' Return a list of users emails
    '''
    list_of_emails = user_repository.get_all_emails()
    return json.dumps(list_of_emails, default=default_parser), 200

@user_blueprint.route("/email/<string:id>", methods=['GET'])
def get_email_id(id):
    '''Get email of a specific user
    '''
    email = user_repository.get_email(id)
    return json.dumps(email, default=default_parser), 200

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


@user_blueprint.route("/user", methods=['PUT'])
def update():
    '''Update user informations
    '''
    user_repository.update(
        json.loads(
            request.data.decode('utf-8')
        )
    )
    return "User successfully updated", 200


@user_blueprint.route("/user/<string:id>", methods=['DELETE'])
def delete(id):
    '''Let the clients delete a user
    '''
    user_repository.delete(id)
    return 'User successfully deleted', 200

# Documents and folders!

@user_blueprint.route("/document/<string:user_id>/<string:folder_id>", methods=['POST'])
def new_document(user_id, folder_id):
    '''Let the clients create a document to an user saved documents
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.new_document(**kwargs)
        return 'Document successfully created', 201
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/document/<string:user_id>", methods=['DELETE'])
def delete_document(user_id):
    ''' Let the clients delete a documet from an user
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.delete_document(**kwargs)
        return 'Document successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/document/<string:user_id>", methods=['PUT'])
def edit_document(user_id):
    ''' Edit a user document, update the document content
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.edit_document(**kwargs)

        return 'Document successfully edited', 202
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/share/edit", methods=['PUT'])
def edit_document_shared():
    ''' Let the documents edit the content of a user shared document
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        print kwargs
        user_repository.edit_document_shared(**kwargs)

        return 'Document successfully edited', 202
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folders/<string:user_id>", methods=['GET'])
def get_folders(user_id):
    ''' Retrive all user folders
    '''
    try:
        folders = user_repository.get_folders(user_id)
        return json.dumps(folders, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404



@user_blueprint.route("/folders_tree/<string:user_id>", methods=['GET'])
def get_folders_tree(user_id):
    '''Retrive all folders and documents on a node tree format to let cliets show the document in a more friendly way
    '''
    try:
        folders = [user_repository.get_folders_tree(user_id)]
        return json.dumps(folders, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folder/<string:user_id>", methods=['POST'])
def new_folder(user_id):
    ''' Create a folder to a user
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.new_folder(**kwargs)
        return "Folder created sucessfully"
    except Exception as e:
        return "%s" % (e), 404

@user_blueprint.route("/folder/<string:user_id>/<string:folder_id>", methods=['PUT'])
def rename_Folder(user_id, folder_id):
    '''Rename a folder from user
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.rename_Folder(**kwargs)
        return 'Folder successfully renamed', 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folder/<string:user_id>/<string:folder_id>", methods=['DELETE'])
def delete_folder(user_id, folder_id):
    ''' Let the clients delete an user folder
    '''
    try:
        kwargs = {}
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.delete_folder(**kwargs)
        return 'Folder successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 404


@user_blueprint.route("/share/<string:user_id>/<string:document_id>", methods=['PUT'])
def share_document(user_id, document_id):
    '''Share a document from an user with other user
    '''
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        kwargs['document_id'] = document_id
        user_repository.share_document(**kwargs)
        return 'Document successfully shared', 200
        #return "OK", 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/share/<string:user_id>", methods=['GET'])
def get_shared_documents(user_id):
    ''' Retrive all documets shareds with an user
    '''
    try:
        shared_documents = user_repository.get_shared_with_me_documents(user_id)
        return json.dumps(shared_documents, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404
