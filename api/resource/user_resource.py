#-*- encoding: utf-8 -*-

from flask import Blueprint, request
from repository.user_repository import UserRepository
from shared.utils import default_parser

import simplejson as json

user_repository = UserRepository()

user_blueprint = Blueprint('user_blueprint', __name__)

@user_blueprint.route("/users", methods=['GET'])
def list():
    return json.dumps(user_repository.list(), default=default_parser), 200


@user_blueprint.route("/user/<string:id>", methods=['GET'])
def get(id):
    user = user_repository.get(id)
    return json.dumps(user, default=default_parser), 200


@user_blueprint.route("/user/<string:email>/<string:password>", methods=['GET'])
def autenticate(email, password):
    user = user_repository.autenticate(email, password)
    if user:
        return json.dumps(user, default=default_parser), 200
    else:
        return "Oh snap!", 404



@user_blueprint.route("/user", methods=['POST'])
def post():
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
    user_repository.update(
        json.loads(
            request.data.decode('utf-8')
        )
    )
    return "User successfully updated", 200


@user_blueprint.route("/user/<string:id>", methods=['DELETE'])
def delete(id):
    user_repository.delete(id)
    return 'User successfully deleted', 200

# Documents and folders!

@user_blueprint.route("/document/<string:user_id>/<string:folder_id>", methods=['POST'])
def new_document(user_id, folder_id):
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
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.delete_document(**kwargs)
        return 'Document successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/document/<string:user_id>", methods=['PUT'])
def edit_document(user_id):
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.edit_document(**kwargs)

        return 'Document successfully edited', 202
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folders/<string:user_id>", methods=['GET'])
def get_folders(user_id):
    try:
        folders = user_repository.get_folders(user_id)
        return json.dumps(folders, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folders_tree/<string:user_id>", methods=['GET'])
def get_folders_tree(user_id):
    try:
        folders = [user_repository.get_folders_tree(user_id)]
        return json.dumps(folders, default=default_parser), 200
    except Exception as e:
        return '%s' % (e), 404

@user_blueprint.route("/folder/<string:user_id>", methods=['POST'])
def new_folder(user_id):
    try:
        kwargs = json.loads(request.data.decode('utf-8'))
        kwargs['user_id'] = user_id
        user_repository.new_folder(**kwargs)
        return "Folder created sucessfully"
    except Exception as e:
        return "%s" % (e), 404

@user_blueprint.route("/folder/<string:user_id>/<string:folder_id>", methods=['PUT'])
def rename_Folder(user_id, folder_id):
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
    try:
        kwargs = {}
        kwargs['user_id'] = user_id
        kwargs['folder_id'] = folder_id
        user_repository.delete_folder(**kwargs)
        return 'Folder successfully deleted', 200
    except Exception as e:
        return '%s' % (e), 404
