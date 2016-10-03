#-*- encoding: utf-8 -*-

from model.folder import Folder
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

import uuid


from flask import Blueprint, request

app = Blueprint('user_blueprint', __name__)

class User(object):
    """ Object that represents a user of Reader """

    def __init__(self, name, email, password, id="0"):
        super(User, self).__init__()
        self.name = name
        self.email = email
        self.password = password
        self.folder = Folder("root")
        self.shared_with_me = {}
        self.trash = []
        self.new_shares = 0

        if id != "0":
            self.id = id
        else:
            self.id = str(uuid.uuid4()).replace('-', '')

    """ Get the user's data """

    def get_basic_data(self):
        return {
            'name': self.name,
            'email': self.email,
            'id': self.id
        }

    def get_authentication(self):
        return {
            'name': self.name,
            'email': self.email,
            'id': self.id,
            'token': self.generate_auth_token()
        }

    """ Search for a folder, if folder doesn't exists raise Exception, else return
    the folder. """

    def search_folder(self, folder_id):
        folder = self.folder.find_folder(folder_id)
        if (folder == None):
            raise Exception("Folder not founded")
        return folder

    """ Search for a document """

    def search_document(self, document_id):
        document = self.folder.find_document(document_id)
        if (document == None):
            raise Exception("Document not found")
        return document

    """ Delete a document, sending it to the trash """

    def delete_document(self, document_id):
        try:
            document = self.search_document(document_id)

            if (document.boolean_trash == False):
                document.boolean_trash = True
                self.trash.append(document)
                self.folder.delete_document(document_id)
        except Exception as e:

            document_trash = None
            for document in self.trash:
                if (document.id == document_id):
                    document_trash = document
            self.trash.remove(document_trash)


    """ Add a document """

    def add_document(self, folder_id, document):
        folder = self.search_folder(folder_id)
        folder.add_document(document)

    """ Edit a document """

    def edit_document(self, document_id, new_name, new_ext, new_content):
        document = self.search_document(document_id)
        document.name = new_name
        document.content = new_content
        document.extension = new_ext

    """ Update the content of the document """

    def update_content(self, content, document_id):
        document = self.search_document(document_id)
        document.content = content

    """ Add folder """

    def user_add_folder(self, parent_folder_id, folder_name):
        parent_folder = self.search_folder(parent_folder_id)
        folder = Folder(folder_name)
        parent_folder.add_folder(folder)

    """ Rename the folder """

    def rename_folder(self, folder_id, folder_new_name):
        folder = self.search_folder(folder_id)
        folder.name = folder_new_name

    """ Delete a folder """

    def delete_folder(self, folder_id):
        self.folder.delete_folder(folder_id)

    def receiveShare(self, user_id, document_id, permission):
        ''' If a document is shared with this user: add the document id and document permission to shared_with_me documents
        '''
        self.new_shares = self.new_shares + 1
        if(self.shared_with_me.has_key(user_id)):
            self.shared_with_me[user_id].append([document_id, permission])
        else:
            self.shared_with_me[user_id] = ([[document_id, permission]])

    def change_share(self, user_id, document_id, change_permission, permission):
        '''Change document permission
        '''
        self.shared_with_me[user_id].remove([document_id, permission])
        self.shared_with_me[user_id].append([document_id, change_permission])

    def restore_trash(self, document_id):
        ''' Retur and delete from trash a document with a document id
        '''
        for document in self.trash:
            if (document.id == document_id):
                document.boolean_trash = False
                self.trash.remove(document)
                return document

    def __eq__(self, other_user):
        if isinstance(other_user, User):
            return (
                self.name == other_user.name
                and self.email == other_user.email
            )
        return False

    def __hash__(self):
        return hash(self.id)

    def __repr__(self):
        return '%s: %s' % (self.name, self.email)

    def generate_auth_token(self, expiration = 86400):
        s = Serializer('AA2318AEE9BC58FE1B36599871283', expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer('AA2318AEE9BC58FE1B36599871283')

        try:
            data = s.loads(token)

        except SignatureExpired:

            return False # valid token, but expired
        except BadSignature:

            return False  # invalid token

        return True
