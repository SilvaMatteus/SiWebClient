
app.controller("homeController", homeController);


function homeController($scope, $http, Session, $location, $state, notificationFactory) {

    $scope.username = Session.getName();
    $scope.userId = Session.getId();
    $scope.email = Session.getEmail();
    $scope.token = Session.getToken();
    $scope.currentDocument = {}
    $scope.currentDocumentId = undefined
    $scope.currentSharedDocument = {}
    $scope.currentSharedDocumentId = undefined

    $scope.logout = function () {
        Session.logout();
        $state.transitionTo("app.login");
    }

    /*
     What is new!
     */
    $scope.whatIsNewModal = function () {
        $('#whatIsNewModal').modal('toggle');
    }

    /*
     Update user documents
     */
    $scope.getFolders = function () {

        $http({
            method: "GET",
            url: "http://127.0.0.1:5000/folders_tree/" + $scope.userId + "/" + $scope.token
        }).then(function mySucces(response) {

            $scope.treeNodes = response.data[0].children
            $scope.rootFolderId = response.data[0].id
            $scope.currentFolderId = $scope.rootFolderId
            $scope.currentDocumentId = undefined

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Unable to retrieve folders! Try logging again.", function () {});
            }
        });
    }

    /*
     Get a list of emails to be shown to user
     */
    $scope.getListOfEmails = function () {
        $http({
            method: "GET",
            url: "http://127.0.0.1:5000/list-emails" + "/" + $scope.token
        }).then(function mySucces(response) {
            $scope.listOfEmails = response.data
            $scope.listOfEmails.splice($scope.listOfEmails.indexOf($scope.email), 1);
        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Unable to retrieve list of user's emails!", function () {});
            }
        });
    }

    /*
     New Document modal
     */
    $scope.newCreateModal = function () {
        $scope.newDocument = {}
        $scope.newDocument.document_ext = ".txt"
        $('#newCreateModal').modal('toggle');
    }

    /*
     Post a new document
     */
    $scope.createDocument = function () {
        $http({
            method: "POST",
            url: "http://127.0.0.1:5000/document/" + $scope.userId + "/" + $scope.currentFolderId  + "/" + $scope.token,
            data: $scope.newDocument
        }).then(function mySucces(response) {
            $('#newCreateModal').modal('toggle');
            $scope.getFolders()
            $scope.newDocument = undefined;
            notificationFactory.showSuccess("Document saved!", function () {
            });

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Document not saved", function () {});
            }
        });
    }

    /*
     Edit user document
     */
    $scope.newEditModal = function () {

        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be edited", function () {
            });
        } else {
            $scope.documentToEdit = {}
            $scope.documentToEdit.document_name = $scope.currentDocument.title
            $scope.documentToEdit.document_content = $scope.currentDocument.content
            $scope.documentToEdit.document_ext = $scope.currentDocument.extension
            $('#newEditModal').modal('toggle');
        }

    }

    /*
     Update the user's document
     */
    $scope.updateDocumentOwned = function () {
        $http({
            method: "PUT",
            url: "http://127.0.0.1:5000/document/" + $scope.userId + "/" + $scope.token,
            data: {
                document_name: $scope.documentToEdit.document_name,
                document_content: $scope.documentToEdit.document_content,
                document_ext: $scope.documentToEdit.document_ext,
                document_id: $scope.currentDocumentId
            }
        }).then(function mySucces(response) {
            $('#newEditModal').modal('toggle');

            $scope.currentDocument.title = $scope.documentToEdit.document_name
            $scope.currentDocument.content = $scope.documentToEdit.document_content
            $scope.currentDocument.extension = $scope.documentToEdit.document_ext
            $scope.getFolders()

            notificationFactory.showSuccess("Document edited!", function () {
            });

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Document not edited", function () {});
            }
        });
    }

    /*
     Delete user document
     */
    $scope.showWarningToDelete = function () {
        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be deleted", function () {
            });
        } else {
            $('#deleteWarningModal').modal('toggle');
        }
    }

    $scope.deleteDocument = function () {
        $('#deleteWarningModal').modal('toggle');
        $http({
            method: "DELETE",
            url: "http://127.0.0.1:5000/document/" + $scope.userId + "/" + $scope.token,
            data: {document_id: $scope.currentDocumentId}
        }).then(function mySucces(response) {
            $scope.currentDocument.title = undefined
            $scope.currentDocument.content = undefined
            $scope.currentDocument.extension = undefined
            notificationFactory.showSuccess("Document deleted!", function () {
            });
            $scope.getFolders()
            $scope.get_trash_documents()

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Document not deleted", function () {});
            }
        });
    }

    /*
     Delete  modal
     */
    $scope.newFolderModal = function () {
        $('#newFolderModal').modal('toggle');
    }

    /*
     Create a new folder
     */
    $scope.createFolder = function () {
        var data = {
            parent_folder_id: $scope.currentFolderId,
            folder_name: $scope.newFolder.folder_name
        };
        $http({
            method: "POST",
            url: "http://127.0.0.1:5000/folder/" + $scope.userId + "/" + $scope.token,
            data: data
        }).then(function mySucces(response) {
            $('#newFolderModal').modal('toggle');
            $scope.getFolders()
            $scope.newFolder = undefined;
            notificationFactory.showSuccess("Folder created!", function () {
            });
        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Folder not creaded!", function () {});
            }
        });
    }

    /*
     Rename folder modal
     */
    $scope.newRenameFolderModal = function () {

        if ($scope.currentFolderId == $scope.rootFolderId)
            notificationFactory.showError("Select a folder!", function () {
            });
        else
            $('#renameFolderModal').modal('toggle');

    }

    /*
     Rename folder
     */
    $scope.renameFolder = function () {
        $http({
            method: "PUT",
            url: "http://127.0.0.1:5000/folder/" + $scope.userId + "/" + $scope.currentFolderId + "/" + $scope.token,
            data: $scope.newNameFolder
        }).then(function mySucces(response) {
            $('#renameFolderModal').modal('toggle');
            $scope.getFolders()
            notificationFactory.showSuccess("Folder renamed!", function () {
            });

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Folder not renamed!", function () {});
            }
        });
    }

    /*
     Delete folder modal
     */
    $scope.deleteFolderModal = function () {
        if ($scope.currentFolderId == $scope.rootFolderId)
            notificationFactory.showError("Select a folder!", function () {
            });
        else
            $('#deleteWarningFolderModal').modal('toggle');

    }

    /*
     Delete a folder and its documents
     */
    $scope.deleteFolder = function () {
        $http({
            method: "DELETE",
            url: "http://127.0.0.1:5000/folder/" + $scope.userId + "/" + $scope.currentFolderId + "/" + $scope.token
        }).then(function mySucces(response) {
            $('#deleteWarningFolderModal').modal('toggle');
            $scope.getFolders()
            notificationFactory.showSuccess("Folder deleted!", function () {
            });

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Folder not deleted!", function () {});
            }
        });
    }

    /*
     Show share document modal
     */
    $scope.newShareModal = function () {
        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be shared", function () {
            });
        } else {
            $scope.sharing = {}
            $scope.sharing.permission = "read"
            $('#shareModal').modal('toggle');
        }
    }

    /*
     Share a document
     */
    $scope.shareDocument = function () {
        $http({
            method: "PUT",
            url: "http://127.0.0.1:5000/share/" + $scope.userId + "/" + $scope.currentDocumentId + "/" + $scope.token,
            data: $scope.sharing
        }).then(function mySucces(response) {
            $('#shareModal').modal('toggle');
            $scope.getSharedWithMe()
            notificationFactory.showSuccess("Document shared!", function () {
            });
        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Unable to share document", function () {});
            }
        });
    }

    /*
     Update documents shared with me
     */
    $scope.getSharedWithMe = function () {
        $http({
            method: "GET",
            url: "http://127.0.0.1:5000/share/" + $scope.userId + "/" + $scope.token
        }).then(function mySucces(response) {
            $scope.documents_shared_with_me = response.data[0]
            $scope.treeNodesShared = response.data[0]
            if (response.data[1] != 0) {
                notificationFactory.showSuccess("You have " + response.data[1] + " new documents shared you!", function () {
                });
            }
        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Unable to retrieve shared documents! Try logging again.", function () {});
            }
        });
    }

    $scope.get_trash_documents = function () {
        $http({
            method: "GET",
            url: "http://127.0.0.1:5000/trash/" + $scope.userId + "/" + $scope.token
        }).then(function mySucces(response) {
            $scope.treeNodesTrash = response.data

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Unable to retrieve shared documents! Try logging again.", function () {});
            }
        });
    }

    $scope.restoreTrash = function () {

    }

    /*
     Update user's document
     */
    $scope.updateDocumentOwned = function () {
        $http({
            method: "PUT",
            url: "http://127.0.0.1:5000/document/" + $scope.userId + "/" + $scope.token,
            data: {
                document_name: $scope.currentDocument.title,
                document_content: $scope.currentDocument.content,
                document_ext: $scope.currentDocument.extension,
                document_id: $scope.currentDocumentId
            }
        }).then(function mySucces(response) {
            $('#newEditModal').modal('toggle');
            $scope.getFolders()

            notificationFactory.showSuccess("Document edited!", function () {
            });

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Document not edited!", function () {});
            }
        });
    }

    /*
     Edit a shared document
     */
    $scope.updateDocumentShared = function () {
        $http({
            method: "PUT",
            url: "http://127.0.0.1:5000/share/edit" + "/" + $scope.token,
            data: {
                ownerId: $scope.currentDocument.ownerId,
                document_content: $scope.currentDocument.content,
                document_id: $scope.currentDocumentId
            }
        }).then(function mySucces(response) {
            $('#editSharedDocumentModal').modal('toggle');
            $scope.getSharedWithMe()
            notificationFactory.showSuccess("Document shared edited!", function () {
            });

        }, function myError(response) {
            if (response.data == "Invalid token") {
                $scope.logout();
                notificationFactory.showError("Token expired or invalid. Please log in again.", function () {});
            } else {
                notificationFactory.showError("Document shared not edited!", function () {});
            }
        });
    }

    /*
     Handle document's click
     */
    $scope.$on('selection-changed', function (e, node) {
        //node - selected node in tree
        $scope.selectedNode = node;
        if (node.is_folder) {
            $scope.currentFolderId = node.id
            $scope.currentDocumentId = undefined
        } else {
            $scope.currentFolderId = $scope.rootFolderId
            $scope.currentDocumentId = node.id
            $scope.currentDocument.content = node.content
            $scope.currentDocument.title = node.name
            $scope.currentDocument.extension = node.extension
            $scope.currentDocument.ownerId = node.ownerId
            $scope.currentDocument.permission = node.permission
            $scope.currentDocument.boolean_trash = node.boolean_trash

        }
    });

    /*
     Handle modal to be shown to edit document
     */
    $scope.editModalHandle = function () {

        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be edited!", function () {
            });
            return;
        }

        if ($scope.currentDocument.permission == undefined)
            $('#newEditModal').modal('toggle');
        if ($scope.currentDocument.permission == 'write')
            $('#editSharedDocumentModal').modal('toggle');
    }


}
