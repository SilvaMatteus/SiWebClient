
app.controller("homeController", homeController);

function homeController($scope, $http, Session, $location, $state, notificationFactory) {

    $scope.username = Session.getName();
    $scope.userId = Session.getId();


    $scope.logout = function () {
        Session.logout();
        $state.transitionTo("app.login");
    }

    $scope.setCurrentDocument = function(index) {
        $scope.currentDocument = $scope.documents[index]
    }

    $scope.newCreateModal = function() {
        $('#newCreateModal').modal('toggle');
    }

    $scope.newEditModal = function() {
        $scope.documentToEdit = $scope.currentDocument;
        $('#newEditModal').modal('toggle');
    }

    $scope.getFolders = function() {
        $http({
           method : "GET",
           url : "http://127.0.0.1:5000/folders/" + $scope.userId
        }).then(function mySucces(response) {
           $scope.folders = response.data;
           $scope.documents = $scope.folders[0].folder_documents;
           $scope.currentDocument = $scope.documents[0];

        }, function myError(response) {
           notificationFactory.showError("Unable to retrieve folders! Try logging again.", function(){});
        });
    }

    $scope.createDocument = function() {
        $http({
           method : "POST",
           url : "http://127.0.0.1:5000/documents/" + $scope.userId,
           data: $scope.newDocument
        }).then(function mySucces(response) {
           $('#newCreateModal').modal('toggle');
           $state.reload();
           notificationFactory.showSuccess("Document saved!", function(){});

        }, function myError(response) {
           notificationFactory.showError("Document not saved", function(){});
        });
    }

    $scope.updateDocument = function() {
        $http({
            method : "PUT",
            url : "http://127.0.0.1:5000/documents/" + $scope.userId,
            data: $scope.documentToEdit
        }).then(function mySucces(response) {
            $('#newEditModal').modal('toggle');
            $state.reload();
            notificationFactory.showSuccess("Document edited!", function(){});

        }, function myError(response) {
            notificationFactory.showError("Document not edited", function(){});
        });
    }
}
