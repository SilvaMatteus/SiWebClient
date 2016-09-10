#-*- encoding: utf-8 -*-
from model.user import User
from model.document import Document
from model.folder import Folder
from shared.utils import SingletonType
from repository.share_utilities import Share_utilities

share_utilities = Share_utilities()

class UserRepository(object):
    """ Repository of users.
    This class is a singleton type.
    """
    __metaclass__ = SingletonType

    def __init__(self):
        super(UserRepository, self).__init__()

        # Creating a user default to make easy the development
        user = User('Fulano', 'email@email.com', 'pwd', "uid")
        document = Document("My document", ".txt", "I think to myself... what a wonderful world!")
        document.id = "did"
        user.folder.id = "fid"
        user.add_document(user.folder.id, document)

        usera = User('Godofredo', 'a@a.com', 'a', "uida")
        documenta = Document("My document", ".txt", "I think to myself... what a bugged world!")
        documenta.id = "dida"
        usera.folder.id = "fida"
        usera.add_document(usera.folder.id, documenta)

        self.list_of_users = [user, usera]

    def list(self):
        return self.list_of_users

    def get_all_emails(self):
        emails = []
        for user in self.list_of_users:
            emails.append(user.email)
        return emails

    def get(self, id):
        for user in self.list_of_users:
            if user.id == id:
                return user

        raise ValueError('User ID not found')

    def get_by_email(self, email):
        for user in self.list_of_users:
            if user.email == email:
                return user

        raise ValueError('User Email not found')

    def autenticate(self, email, password):
        for user in self.list_of_users:
            if user.email == email and user.password == password:
                return user.get_basic_data()

        raise ValueError('User not registered!')

    def new(self, kwargs):

        new_user = User(**kwargs)
        if new_user in self.list_of_users:
            raise Exception('User already exists!')

        self.list_of_users.append(new_user)

    def update(self, kwargs):
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

    def delete(self, id):
        user_to_delete = self.get(id)
        self.list_of_users.remove(user_to_delete)

    def new_document(self, user_id, folder_id, document_name, document_ext, document_content = ""):
        user = self.get(user_id)
        documment = Document(document_name, document_ext, document_content)
        user.add_document(folder_id, documment)

    def edit_document(self, user_id, document_name, document_ext, document_content, document_id):
        user = self.get(user_id)
        user.edit_document(document_id, document_name, document_ext, document_content)

    def delete_document(self, user_id, document_id):
        user = self.get(user_id)
        user.delete_document(document_id)

    def get_folders(self, user_id):
        user = self.get(user_id)
        return user.folder

    def get_folders_tree(self, user_id):
        user = self.get(user_id)
        return user.folder.to_json_tree()

    def new_folder(self, user_id, parent_folder_id, folder_name):
        user = self.get(user_id)
        user.user_add_folder(parent_folder_id, folder_name)

    def rename_Folder(self, user_id, folder_id, folder_name):
        user = self.get(user_id)
        user.rename_folder(folder_id, folder_name)

    def delete_folder(self, user_id, folder_id):
        user = self.get(user_id)
        user.delete_folder(folder_id)

    def share_document(self, user_id, document_id, other_user_email, permission):
        '''Encontra os usuários e compartilha os documentos usando uma classe epecialista nisso,
         tem que receber a opção de compartilhamento eo passar no método
        '''
        user = self.get(user_id)
        other_user = self.get_by_email(other_user_email)
        share_utilities.share(user, other_user, document_id, permission)


    def get_shared_documents(self, user_id):
        '''pega os documentos compartilhados com o usuário
        '''
        documents = []
        user = self.get(user_id)
        mapadeUsuariosEDocumentos = share_utilities.get_shared_documents(user)
        for userId in mapadeUsuariosEDocumentos.keys():
            user = get(userId)
            for docId in mapadeUsuariosEDocumentos[userId]:
                documents.append(user.search_document(docId))
        return documents
