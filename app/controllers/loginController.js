/**
* Login Controller
*/
app.controller('loginController', loginController);

function loginController($scope, $timeout, notificationFactory, Session, $http, $state) {

    $scope.count = 1024;
    $scope.perc = 25.5;

    (function increment() {
        $scope.count++;
        $scope.perc += 0.3;
        if ($scope.count > 0) {
            $timeout(increment, 1000);
        }
    })();


    $scope.login = function(){

        var email = $scope.email;
        var password = $scope.password;

        $http({
            method : "GET",
            url : "http://127.0.0.1:5000/users/" + email + '/' + password
        }).then(function mySucces(response) {
            Session.setAuthentication(response.data);
            $state.transitionTo("app.home");

        }, function myError(response) {

            notificationFactory.showError("User not registered!", function(){});

        });

    }


}
