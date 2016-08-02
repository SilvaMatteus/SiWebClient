
app.controller("homeController", homeController);

function homeController($scope, $http, Session, $location, $state) {

    $scope.name = Session.getName();

    $scope.logout = function () {
        Session.logout();
        $state.transitionTo("app.login");
    }

    $scope.newModal = function() {
       $('#newModal').modal('toggle');
   }

}
