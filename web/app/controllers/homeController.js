
app.controller("homeController", homeController);


function homeController($scope, $http, Session, $location, $state, notificationFactory) {

    $scope.username = Session.getName();
    $scope.userId = Session.getId();
    $scope.currentDocument = {}
    $scope.currentDocumentId = undefined

    $scope.logout = function () {
        Session.logout();
        $state.transitionTo("app.login");
    }

    $scope.newCreateModal = function() {
        $('#newCreateModal').modal('toggle');
    }

    $scope.whatIsNewModal = function() {
        $('#whatIsNewModal').modal('toggle');
    }

    $scope.newEditModal = function() {

        if ($scope.currentDocument === undefined) {
            notificationFactory.showError("No document to be edited", function(){});
        } else {
            $scope.documentToEdit = {}
            $scope.documentToEdit.document_name = $scope.currentDocument.title
            $scope.documentToEdit.document_content = $scope.currentDocument.content
            $('#newEditModal').modal('toggle');
        }

    }

    $scope.getFoldersAndShared = function() {
        getFolders()
        getSharedWithMe()
    }


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

    $scope.updateDocument = function() {
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

    $scope.showWarningToDelete = function() {
        if ($scope.currentDocument === undefined) {
            notificationFactory.showError("No document to be deleted", function(){});
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

    $scope.newRenameFolderModal = function(){

        if ($scope.currentFolderId === $scope.rootFolderId)
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
/*Abre o modal de compartilhar o documento
*/
    $scope.newShareModal = function() {
        if ($scope.currentDocument === undefined) {
            notificationFactory.showError("No document to be shared", function(){});
        } else {
            $('#shareModal').modal('toggle');
        }
    }

/*Quando aperta share no modal, ele manda pra api o user id logado, o email do outro user e o documento atual
tem que mandar ainda o lance de apenas visualizar ou editar também!
*/
    $scope.shareDocument = function() {
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
    }

    $scope.getSharedWithMe = function() {
        $http({
            method : "GET",
            url : "http://127.0.0.1:5000/share/" + $scope.userId,
        }).then(function mySucces(response) {
            $scope.documents_shared_with_me = response.data
        }, function myError(response) {
           notificationFactory.showError("Unable to retrieve shared documents! Try logging again.", function(){});
        });
    }
/* Tem que fazer um método para pegar os documentos compartilhados com o usuário logao e comolocar naquela view verdinha
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
        }
    });

}
