#-*- encoding: utf-8 -*-
from model.user import User
from model.document import Document
from shared.utils import SingletonType

class Share_utilities(object):
    """Singleton class responsible to share documents.
    """
    __metaclass__ = SingletonType

    def __init__(self):
        super(Share_utilities, self).__init__()

    def share(self, user, other_user, document_id, permission):
        """
        """
        # '''Adiciona na lista do documento o id do usuário que pode ver ou ver/editar o documento
        # e no usuário coloca o documento no shared_with_me'''
        document_from_user = user.search_document(document_id)
        if(permission == "write"):
            document_from_user.shareViewAndEditAdd(other_user.id)
        elif(permission == "read"):
            document_from_user.shareViewAdd(other_user.id)
        other_user.receiveShare(user.id, document_id)

    def get_shared_documents(self, user):
        return user.shared_with_me
