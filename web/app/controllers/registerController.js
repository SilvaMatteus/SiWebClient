app.controller('registerController', registerController);


/*
    Create a new user
 */
function registerController($scope, notificationFactory, $http, $state) {

    $scope.save = function() {

        $scope.button_disabled = true;

        res = $http.post('http://127.0.0.1:5000/user', $scope.newUser)

            .success(function(data){
                notificationFactory.showSuccess("New user sucessfully! Registed", function(){
                    $state.transitionTo("app.login");
                });
            }).error(function(data){
                notificationFactory.showError("Error trying to Register new user!", function(){
                    $scope.button_disabled = false;
                });

            });
    }
}
