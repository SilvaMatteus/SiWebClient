/**
 * Created by ordan on 01/08/16.
 */

app.controller("loginController", loginController);

function loginController($scope, $http, Auth, $location, $state){

    $scope.login = function(){

        $http({
            method : "GET",
            url : "http://127.0.0.1:5000/users"
        }).then(function mySucces(response) {
            $scope.teste = response.data[0].name;
            Auth.setAuthentication(response.data[0].name);

            sessionStorage.auth = response.data[0].name;

            $state.transitionTo("app.home");
        }, function myError(response) {
            $scope.teste = response.statusText;
        });

    }

    $scope.logout = function(){
        sessionStorage.clear();
        Auth.setAuthentication(false);
       $state.transitionTo("app.login");

    }

     $scope.name = sessionStorage.auth;
}

