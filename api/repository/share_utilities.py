#-*- encoding: utf-8 -*-
from model.user import User
from model.document import Document
from shared.utils import SingletonType

class Share_utilities(object):
    """Singleton class, has the reponsability to do share related operations
    """
    __metaclass__ = SingletonType

    def __init__(self):
        super(Share_utilities, self).__init__()

    def share(self, user, other_user, document_id, permission):
        '''
        This method shares a document from a user with other user
        It dont let the user share a document with himself
        Verify if the documen is already shared, update it if needed
        If not already shared, do the normal share operation
        '''
        if (user == other_user):
            raise ValueError('You cannot share to yourself!')

        if(not self.doc_already_shared(user, other_user, document_id, permission)):
            document_from_user = user.search_document(document_id)
            if(permission == "write"):
                document_from_user.shareViewAndEditAdd(other_user.id)
            elif(permission == "read"):
                document_from_user.shareViewAdd(other_user.id)
            other_user.receiveShare(user.id, document_id, permission)

    def doc_already_shared(self, user, other_user, document_id, permission):
        '''Verify if the documen is already shared, update it if needed
        '''
        docs_shared_with_other_user = self.get_shared_documents(other_user)
        if(user.id in docs_shared_with_other_user.keys()):
            if([document_id, permission] in docs_shared_with_other_user[user.id]):
                return True
            elif([document_id, self.change_permission(permission)] in docs_shared_with_other_user[user.id]):
                document_from_user = user.search_document(document_id)
                document_from_user.change_share(other_user.id)
                other_user.change_share(user.id, document_id, permission, self.change_permission(permission))
                return True
            else:
                return False

    def change_permission(self, permission):
        '''Return the oposite permission
        '''
        if(permission == "read"):
            return "write"
        elif(permission == "write"):
            return "read"

    def get_shared_documents(self, user):
        '''Return the documents shared with an user  
        '''
        return user.shared_with_me
