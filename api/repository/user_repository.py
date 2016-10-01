#-*- encoding: utf-8 -*-
from model.user import User
from model.document import Document
from model.folder import Folder
from shared.utils import SingletonType
from repository.share_utilities import Share_utilities

share_utilities = Share_utilities()


from flask import request, redirect, render_template

from dobbin.database import Database
from dobbin.persistent import Persistent
import transaction
from dobbin.persistent import checkout

class UserRepository(object):
    """ Repository of users.
    This class is a singleton type. This class contans all users and the operations related with user data
    """
    __metaclass__ = SingletonType

    def __init__(self):

        db = Database('database')

        if db .root is None:

            root = Persistent()
            root.list_of_users = []
            db.elect (root)
            transaction.commit()

            checkout(db.root)

            self.list_of_users = db.root.list_of_users

            # Creating a user default to make easy the development
            user = User('Fulano', 'email@email.com', 'pwd', "uid")
            document = Document("My document", ".txt", "I think to myself... what a wonderful world!", "uid")
            document.id = "did"
            user.folder.id = "fid"
            user.add_document(user.folder.id, document)

            db.root.list_of_users.append(user)
            db.root.list_of_users = self.list_of_users

            transaction.commit()

            checkout(db .root)

            self.list_of_users = db .root.list_of_users
        else:
            self.list_of_users = db.root.list_of_users
        super(UserRepository, self).__init__()




    def list(self):
        ''' Return the list of user
        '''
        return self.list_of_users

    def get_all_emails(self):
        ''' Return a list of users emails
        '''
        emails = []
        for user in self.list_of_users:
            emails.append(user.email)
        return emails

    def get_email(self, id):
        ''' Return an user email
        '''
        email = ""
        for user in self.list_of_users:
            if user.id == id:
                email = user.email
        return email

    def get(self, id):
        ''' Retur a user
        '''
        for user in self.list_of_users:
            if user.id == id:
                return user

        raise ValueError('User ID not found')

    def get_by_email(self, email):
        ''' Return an specific user
        '''
        for user in self.list_of_users:
            if user.email == email:
                return user

        raise ValueError('User Email not found')

    def autenticate(self, email, password):
        '''Return the user if email and password match
        If dont match raise an Error
        '''
        for user in self.list_of_users:
            if user.email == email and user.password == password:
                return user.get_basic_data()

        raise ValueError('User not registered!')

    def new(self, kwargs):
        '''Adds a user to list of users if it don't alread exists
        '''
        new_user = User(**kwargs)
        if new_user in self.list_of_users:
            raise Exception('User already exists!')

        self.list_of_users.append(new_user)
        self.save()

    def update(self, kwargs):
        '''Update an user information
        Create an user and try to find the user on the list of users
        If not finded raise a error
        '''
        user_updated = User(**kwargs)
        sucess = False
        for user in self.list_of_users:
            if user_updated == user:
                user.name = user_updated.name
                user.email = user_updated.email
                user.password = user_updated.password
                sucess = True
        if not sucess:
            raise ValueError('ID not found')
        self.save()

    def delete(self, id):
        ''' Delete a user using an ID
        '''
        user_to_delete = self.get(id)
        self.list_of_users.remove(user_to_delete)
        self.save()

    def new_document(self, user_id, folder_id, document_name, document_ext, document_content = ""):
        ''' Find an user and add a new document to it
        '''
        user = self.get(user_id)
        documment = Document(document_name, document_ext, document_content, user_id)
        user.add_document(folder_id, documment)
        self.save()

    def edit_document(self, user_id, document_name, document_ext, document_content, document_id):
        ''' Find a user and update document from it
        '''
        user = self.get(user_id)
        user.edit_document(document_id, document_name, document_ext, document_content)
        self.save()

    def edit_document_shared(self, ownerId, document_content, document_id):
        ''' Find an user and a shared with the user document and update it
        '''
        user = self.get(ownerId)
        user.update_content(document_content,document_id)
        self.save()

    def delete_document(self, user_id, document_id):
        ''' Find an user and delete a document from it
        '''
        user = self.get(user_id)
        user.delete_document(document_id)
        self.save()

    def get_folders(self, user_id):
        ''' Find a user and return it folders
        '''
        user = self.get(user_id)
        return user.folder

    def get_folders_tree(self, user_id):
        ''' Find a user and return it folders on a node format
        '''
        user = self.get(user_id)
        return user.folder.to_json_tree()

    def new_folder(self, user_id, parent_folder_id, folder_name):
        ''' Find a user and add a new folder to it
        '''
        user = self.get(user_id)
        user.user_add_folder(parent_folder_id, folder_name)
        self.save()

    def rename_Folder(self, user_id, folder_id, folder_name):
        ''' Find a user and rename a spadific folder
        '''
        user = self.get(user_id)
        user.rename_folder(folder_id, folder_name)
        self.save()

    def delete_folder(self, user_id, folder_id):
        ''' Find a user and delete a specific folder
        '''
        user = self.get(user_id)
        user.delete_folder(folder_id)
        self.save()

    def share_document(self, user_id, document_id, other_user_email, permission):
        ''' Find an user by ID, find othe user by email and share a document from user to other user
        '''
        user = self.get(user_id)
        other_user = self.get_by_email(other_user_email)
        share_utilities.share(user, other_user, document_id, permission)

    def get_shared_with_me_documents(self, user_id):
        '''Find user and return the documents other users shared with it
        It updates new shares variable for new share notification feature
        return the list of documents shared with user and the number of new shares
        '''
        documents = []
        user = self.get(user_id)

        new_shares = 0
        new_shares = user.new_shares
        user.new_shares = 0

        mapadeUsuariosEDocumentos = user.shared_with_me
        for userId in mapadeUsuariosEDocumentos.keys():
            userOwner = self.get(userId)
            for docIdAndPermission in mapadeUsuariosEDocumentos[userId]:
                try:
                    docAtual = userOwner.search_document(docIdAndPermission[0])
                    docAtual.permission = docIdAndPermission[1]
                    documents.append(docAtual)
                except:
                    mapadeUsuariosEDocumentos[userId].remove(docIdAndPermission)
        result = [documents, new_shares]
        return result

    def save(self):

        db = Database('database')
        checkout(db.root)
        db.root.list_of_users = self.list_of_users
        transaction.commit()
