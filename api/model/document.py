#-*- encoding: utf-8 -*-

import uuid

""" This module contains the Document class of the Reader's model.
"""

class Document(object):
    """ Object that represents a document of Reader
    """

    def __init__(self, name, extension, content, ownerId, folderId):
        """ Constructor of Document.
        Document has a name, an extension(.txt/.md), a contend, an ownerId, a exclusive id
        Docment has two list of userIds to control witch user can read or write the document
        """
        super(Document, self).__init__()
        self.name = name
        self.extension = extension
        self.content = content
        self.ownerId = ownerId
        self.folderId = folderId
        self.boolean_trash = False
        self.id = str(uuid.uuid4()).replace('-', '')
        self.shareViewAndEdit = []
        self.shareView = []

    def shareViewAdd(self, user_id):
        self.shareView.append(user_id)

    def shareViewAndEditAdd(self, user_id):
        self.shareViewAndEdit.append(user_id)

    def change_share(self, user_id_to_change):
        '''The methos change the user_id_to_change between shareViewAndEdit an shareView lists
        '''
        for user_id in self.shareViewAndEdit:
            if(user_id == user_id_to_change):
                self.shareViewAndEdit.remove(user_id_to_change)
                self.shareView.append(user_id_to_change)
        for user_id in self.shareView:
            if(user_id == user_id_to_change):
                self.shareView.remove(user_id_to_change)
                self.shareViewAndEdit.append(user_id_to_change)

    def removeShare(self, user_id_to_remove):
        ''' Remove user Id from share lists
        '''
        for user_id in self.shareViewAndEdit:
            if(user_id == user_id_to_remove):
                self.shareViewAndEdit.remove(user_id_to_remove)
        for user_id in self.shareView:
            if(user_id == user_id_to_remove):
                self.shareView.remove(user_id_to_remove)

    def __eq__(self, other):
        """ Equals method of a Document.
        """
        if isinstance(other, Document):
            return self.id == other.id
        return False
