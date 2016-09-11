#-*- encoding: utf-8 -*-

import uuid

class Folder(object):
    """ Object that represents a folder of Reader """

    def __init__(self, name):
        super(Folder, self).__init__()
        self.name = name
        self.documents = []
        self.folders = []
        self.id = str(uuid.uuid4()).replace('-', '')

    def add_document(self, document):
        self.documents.append(document)

    def add_folder(self, folder):
        self.folders.append(folder)


    def find_folder(self, id_folder):
        if (self.id == id_folder):
            return self

        for folder in self.folders:
            f = folder.find_folder(id_folder)
            if f != None:
                return f

        return None

    def find_document(self, document_id):
        for document in self.documents:
            if document.id == document_id:
                return document
        for folder in self.folders:
            d = folder.find_document(document_id)
            if d != None:
                return d
        return None

    def to_json_tree(self):
        object = {}
        object['name'] = self.name
        object['id'] = self.id
        object['is_folder'] = True

        object['children'] = []

        for folder in self.folders:
            f = folder.to_json_tree()
            object['children'].append(f)

        for document in self.documents:
            d = {}
            d['name'] = document.name
            d['id'] = document.id
            d['is_folder'] = False
            d['content'] = document.content
            d['extension'] = document.extension
            d['ownerId'] = document.ownerId

            object['children'].append(d)

        return object

    def delete_document(self, document_id):
        document = self.find_document(document_id)
        if document != None:
            self.documents.remove(document)
            return True
        for folder in self.folders:
            if folder.delete_document(document_id):
                return True
        return False

    def delete_folder(self, folder_id):
        for folder in self.folders:
            if folder.id == folder_id:
                self.folders.remove(folder)
                return True
            if folder.delete_folder(folder_id):
                return True

        return False

    def __eq__(self, other):
        if isinstance(other, Folder):
            return self.id == other.id
        return False
