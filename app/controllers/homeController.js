
app.controller("homeController", homeController);

function homeController($scope, $http, Session, $location, $state, notificationFactory) {

    $scope.username = Session.getName();
    $scope.userId = Session.getId();

    $scope.logout = function () {
        Session.logout();
        $state.transitionTo("app.login");
    }

    $scope.newCreateModal = function() {
        $('#newCreateModal').modal('toggle');
   }

   $scope.createDocument = function() {
       $http({
           method : "POST",
           url : "http://127.0.0.1:5000/documents/" + $scope.userId,
           data: $scope.newDocument
       }).then(function mySucces(response) {
           $('#newCreateModal').modal('toggle');
           notificationFactory.showSuccess("Document saved!", function(){});

       }, function myError(response) {
           notificationFactory.showError("Document not saved", function(){});
       });
   }

   <!-- documentos fake! -->
   $scope.documents = ['d1', 'd2', 'd3'];

   $scope.currentDocument = "blablabla"

}
