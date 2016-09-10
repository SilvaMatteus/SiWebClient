#-*- encoding: utf-8 -*-

import uuid

class Document(object):
    """ Object that represents a document of Reader """

    def __init__(self, name, extension, content):
        super(Document, self).__init__()
        self.name = name
        self.extension = extension
        self.content = content
        self.id = str(uuid.uuid4()).replace('-', '')
        self.shareViewAndEdit = []
        self.shareView = []
        self.deleted = False

    def shareViewAdd(self, user_id):
        self.shareView.append(user_id)

    def shareViewAndEditAdd(self, user_id):
        self.shareViewAndEdit.append(user_id)

    def __eq__(self, other):
        if isinstance(other, Document):
            return self.id == other.id
        return False
