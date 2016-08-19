#-*- encoding: utf-8 -*-

import uuid

class Document(object):
    """ Object that represents a document of Reader """

    def __init__(self, name, content):
        super(Document, self).__init__()
        self.name = name
        self.content = content
        self.id = str(uuid.uuid4()).replace('-', '')

    def __eq__(self, other):
        if isinstance(other, Document):
            return self.id == other.id
        return False
