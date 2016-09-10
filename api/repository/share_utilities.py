from model.user import User
from model.document import Document
from shared.utils import SingletonType

class Share_utilities(object):
'''Classe Singleton especialista em compartilhar documentos
'''

    __metaclass__ = SingletonType

    def __init__(self):
        super(Share_utilities, self).__init__()

    def share(self, user, other_user, document_id, canEdit):
        '''Adiciona na lista do documento o id do usuário que pode ver ou ver/editar o documento
        e no usuário coloca o documento no shared_with_me'''
        document_from_user = user.find_document(document_id)
        if(canEdit):
            document_from_user.shareViewAndEditAdd(other_user.__hash__)
        else:
            document_from_user.shareViewAdd(other_user.__hash__)
        other_user.reciveShare(document_id)
