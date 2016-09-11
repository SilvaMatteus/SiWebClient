
app.controller("homeController", homeController);


function homeController($scope, $http, Session, $location, $state, notificationFactory) {

    $scope.username = Session.getName();
    $scope.userId = Session.getId();
    /*$scope.email = Session.getEmail();*/
    $scope.currentDocument = {}
    $scope.currentDocumentId = undefined
    $scope.currentSharedDocument = {}
    $scope.currentSharedDocumentId = undefined

    $scope.logout = function () {
        Session.logout();
        $state.transitionTo("app.login");
    }

/* What is new!
*/
    $scope.whatIsNewModal = function() {
        $('#whatIsNewModal').modal('toggle');
    }

/* Update user documents
*/
    $scope.getFolders = function() {

        $http({
           method : "GET",
           url : "http://127.0.0.1:5000/folders_tree/" + $scope.userId
        }).then(function mySucces(response) {

            $scope.treeNodes = response.data[0].children
            $scope.rootFolderId = response.data[0].id
            $scope.currentFolderId = $scope.rootFolderId
            $scope.currentDocumentId = undefined

        }, function myError(response) {
           notificationFactory.showError("Unable to retrieve folders! Try logging again.", function(){});
        });
    }

    $scope.getListOfEmails = function() {
        $http({
           method : "GET",
           url : "http://127.0.0.1:5000/list-emails"
        }).then(function mySucces(response) {

            $scope.listOfEmails = response.data

        }, function myError(response) {
           notificationFactory.showError("Unable to retrieve emails of other users!", function(){});
        });
    }

    $scope.getEmailCurrentUser = function() {
        $http({
           method : "GET",
           url : "http://127.0.0.1:5000/email/" + $scope.userId
        }).then(function mySucces(response) {
            $scope.emailOfUser = response.data
        }, function myError(response) {
           notificationFactory.showError("Unable to retrieve emails from current user", function(){});
        });
    }

/* New Document
*/
    $scope.newCreateModal = function() {
        $('#newCreateModal').modal('toggle');
    }

    $scope.createDocument = function() {
        $http({
           method : "POST",
           url : "http://127.0.0.1:5000/document/" + $scope.userId + "/" + $scope.currentFolderId,
           data: $scope.newDocument
        }).then(function mySucces(response) {
           $('#newCreateModal').modal('toggle');
           $scope.getFolders()
           $scope.newDocument = undefined;
           notificationFactory.showSuccess("Document saved!", function(){});

        }, function myError(response) {
           notificationFactory.showError("Document not saved", function(){});
        });
    }

/* Edit user document
*/
    $scope.newEditModal = function() {

        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be edited", function(){});
        } else {
            $scope.documentToEdit = {}
            $scope.documentToEdit.document_name = $scope.currentDocument.title
            $scope.documentToEdit.document_content = $scope.currentDocument.content
            $scope.documentToEdit.document_ext = $scope.currentDocument.extension
            $('#newEditModal').modal('toggle');
        }

    }

    $scope.updateDocumentOwned = function() {
        $http({
            method : "PUT",
            url : "http://127.0.0.1:5000/document/" + $scope.userId,
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

            notificationFactory.showSuccess("Document edited!", function(){});

        }, function myError(response) {
            notificationFactory.showError("Document not edited", function(){});
        });
    }

/* Delete user document
*/
    $scope.showWarningToDelete = function() {
        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be deleted", function(){});
        } else {
            $('#deleteWarningModal').modal('toggle');
        }
    }

    $scope.deleteDocument = function() {
        $('#deleteWarningModal').modal('toggle');
        $http({
            method : "DELETE",
            url : "http://127.0.0.1:5000/document/" + $scope.userId,
            data: {document_id: $scope.currentDocumentId}
        }).then(function mySucces(response) {
            $scope.currentDocument.title = undefined
            $scope.currentDocument.content = undefined
            $scope.currentDocument.extension = undefined
            notificationFactory.showSuccess("Document deleted!", function(){});
            $scope.getFolders()

        }, function myError(response) {
            notificationFactory.showError("Document not deleted", function(){});
        });
    }

/* Delete Folder
*/
    $scope.newFolderModal = function() {
        $('#newFolderModal').modal('toggle');
    }

    $scope.createFolder = function() {
        var data = {
                parent_folder_id: $scope.currentFolderId,
                folder_name: $scope.newFolder.folder_name
            };
        $http({
           method : "POST",
           url : "http://127.0.0.1:5000/folder/" + $scope.userId,
           data: data
        }).then(function mySucces(response) {
           $('#newFolderModal').modal('toggle');
           $scope.getFolders()
           $scope.newFolder = undefined;
           notificationFactory.showSuccess("Folder created!", function(){});
        }, function myError(response) {
           notificationFactory.showError("Folder not created", function(){});
        });
    }

/* Rename folder
*/
    $scope.newRenameFolderModal = function(){

        if ($scope.currentFolderId == $scope.rootFolderId)
            notificationFactory.showError("Select a folder!", function(){});
        else
            $('#renameFolderModal').modal('toggle');

    }

    $scope.renameFolder = function() {
        $http({
           method : "PUT",
           url : "http://127.0.0.1:5000/folder/" + $scope.userId + "/" + $scope.currentFolderId,
           data: $scope.newNameFolder
         }).then(function mySucces(response) {
           $('#renameFolderModal').modal('toggle');
           $scope.getFolders()
           notificationFactory.showSuccess("Folder renamed!", function(){});

        }, function myError(response) {
           notificationFactory.showError("Folder not renamed", function(){});
        });
    }

/* Delete a folder
*/
    $scope.deleteFolderModal = function(){
        if ($scope.currentFolderId == $scope.rootFolderId)
            notificationFactory.showError("Select a folder!", function(){});
        else
            $('#deleteWarningFolderModal').modal('toggle');

    }


    $scope.deleteFolder = function() {
        $http({
          method : "DELETE",
          url : "http://127.0.0.1:5000/folder/" + $scope.userId + "/" + $scope.currentFolderId
        }).then(function mySucces(response) {
          $('#deleteWarningFolderModal').modal('toggle');
          $scope.getFolders()
          notificationFactory.showSuccess("Folder deleted!", function(){});

        }, function myError(response) {
          notificationFactory.showError("Folder not deleted", function(){});
        });
    }

/* Share a document
*/
    $scope.newShareModal = function() {
        if ($scope.currentDocumentId == undefined) {
            notificationFactory.showError("Select a document to be shared", function(){});
        } else {
            $('#shareModal').modal('toggle');
        }
    }

    $scope.shareDocument = function() {
        /*Não esta funcionndo pois nao estamos conseguindo o email do usuário logado*/
        /*$scope.getEmailCurrentUser()
        if($scope.emailOfUser == $scope.sharing.other_user_email){
            notificationFactory.showError("Can't share your own document with you", function(){});
            $('#shareModal').modal('toggle');
        }
        else{*/
            $http({
                method : "PUT",
                url : "http://127.0.0.1:5000/share/" + $scope.userId + "/" + $scope.currentDocumentId,
                data: $scope.sharing
            }).then(function mySucces(response) {
                $('#shareModal').modal('toggle');
                notificationFactory.showSuccess("Document shared!", function(){});
            }, function myError(response) {
                notificationFactory.showError("Document not shared", function(){});
            });
        /*}*/
    }

/* Share a document
*/
    $scope.newSharedDocumentModal = function(){
        if($scope.currentSharedDocument.permission == "read"){
            $('#viewSharedDocumentModal').modal('toggle');
        }else if ($scope.currentSharedDocument.permission == "write") {
            $scope.documentSharedToEdit = {}
            $scope.documentSharedToEdit.document_content = $scope.currentSharedDocument.content
            $('#editSharedDocumentModal').modal('toggle');
        }
    }

/* Update shared eith me documents
*/
    $scope.getSharedWithMe = function() {
        $http({
            method : "GET",
            url : "http://127.0.0.1:5000/share/" + $scope.userId,
        }).then(function mySucces(response) {
            $scope.documents_shared_with_me = response.data[0]
            $scope.documents_shared_with_me_permissions = response.data[1]
            if(response.data[2] != 0){
                notificationFactory.showSuccess("You have "+ response.data[2] +" new documents shared you!", function(){});
            }
        }, function myError(response) {
           notificationFactory.showError("Unable to retrieve shared documents! Try logging again.", function(){});
        });
    }

/* Edit a shared with user document
*/
    $scope.updateDocumentShared = function() {
        $http({
            method : "PUT",
            url : "http://127.0.0.1:5000/share/edit" ,
            data: {
                ownerId: $scope.currentDocument.ownerId,
                document_content: $scope.documentSharedToEdit.document_content,
                document_id: $scope.currentDocumentId
            }
        }).then(function mySucces(response) {
            $('#editSharedDocumentModal').modal('toggle');
            $scope.getSharedWithMe()
            notificationFactory.showSuccess("Document shared edited!", function(){});

        }, function myError(response) {
            notificationFactory.showError("Document shared not edited", function(){});
        });
    }
/* When you click on a document
*/
    $scope.$on('selection-changed', function (e, node) {
        //node - selected node in tree
        $scope.selectedNode = node;

        if (node.is_folder) {
            $scope.currentFolderId = node.id
            $scope.currentDocumentId = undefined
        } else {
            $scope.currentDocument.permission = undefined
            $scope.currentFolderId = $scope.rootFolderId
            $scope.currentDocumentId = node.id
            $scope.currentDocument.content = node.content
            $scope.currentDocument.title = node.name
            $scope.currentDocument.extension = node.extension
            $scope.currentDocument.ownerId = node.ownerId
        }
    });

/* When you click on a document shared with you
*/
    $scope.setCurrentDocumentShared = function(index){
        $scope.currentSharedDocument.ownerId = $scope.documents_shared_with_me[index].ownerId
        $scope.currentSharedDocumentId = $scope.documents_shared_with_me[index].id
        $scope.currentSharedDocument.content = $scope.documents_shared_with_me[index].content
        $scope.currentSharedDocument.title = $scope.documents_shared_with_me[index].name
        $scope.currentSharedDocument.extension = $scope.documents_shared_with_me[index].extension
        $scope.currentSharedDocument.permission = $scope.documents_shared_with_me_permissions[index]
        $scope.newSharedDocumentModal()
    }



}
