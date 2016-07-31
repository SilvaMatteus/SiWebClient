app.controller('registerController', registerController);

function registerController($scope, User, notificationFactory) {

    $scope.newUser = new User();

    $scope.save = function() {
        $scope.newUser.$save(function() {
            notificationFactory.showSuccess("New user sucessfully! Registed", function(){});
        }).catch(function(user) {
            notificationFactory.showError("Erro trying to Register new user!", function(){
                console.log(user.data.error);
            });
        });
    }
}
