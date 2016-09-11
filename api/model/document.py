#-*- encoding: utf-8 -*-

import uuid

""" This module contains the Document class of the Reader's model.
"""

class Document(object):
    """ Object that represents a document of Reader
    """

    def __init__(self, name, extension, content, ownerId):
        """ Constructor of Document.
        """
        super(Document, self).__init__()
        self.name = name
        self.extension = extension
        self.content = content
        self.ownerId = ownerId
        self.id = str(uuid.uuid4()).replace('-', '')
        self.shareViewAndEdit = []
        self.shareView = []

    def shareViewAdd(self, user_id):
        self.shareView.append(user_id)

    def shareViewAndEditAdd(self, user_id):
        self.shareViewAndEdit.append(user_id)

    def __eq__(self, other):
        """ Equals method of a Document.
        """
        if isinstance(other, Document):
            return self.id == other.id
        return False
