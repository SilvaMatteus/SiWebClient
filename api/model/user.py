#-*- encoding: utf-8 -*-

from model.folder import Folder

import uuid

class User(object):
    """ Object that represents a user of Reader """

    def __init__(self, name, email, password, id="0"):
        super(User, self).__init__()
        self.name = name
        self.email = email
        self.password = password
        self.folder = Folder("root")

        if id != "0":
            self.id = id
        else:
            self.id = str(uuid.uuid4()).replace('-', '')

    def get_basic_data(self):
        return {
            'name': self.name,
            'email': self.email,
            'id': self.id
        }

    def search_folder(self, folder_id):
        folder = self.folder.find_folder(folder_id)
        if (folder == None):
            raise Exception("Folder not founded")
        return folder

    def search_document(self, document_id):
        document = self.folder.find_document(document_id)
        if (document == None):
            raise Exception("Document not founded")
        return document

    def delete_document(self, document_id):
        return self.folder.delete_document(document_id)

    def add_document(self, folder_id, document):
        folder = self.search_folder(folder_id)
        folder.add_document(document)

    def edit_document(self, document_id, new_name, new_content):
        document = self.search_document(document_id)
        document.name = new_name
        document.content = new_content

    def user_add_folder(self, parent_folder_id, folder_name):
        parent_folder = self.search_folder(parent_folder_id)
        folder = Folder(folder_name)
        parent_folder.add_folder(folder)

    def rename_folder(self, folder_id, folder_new_name):
        folder = self.search_folder(folder_id)
        folder.name = folder_new_name

    def delete_folder(self, folder_id):
        self.folder.delete_folder(folder_id)

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
