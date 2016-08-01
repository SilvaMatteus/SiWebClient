/**
* Login Controller
*/
app.controller('userController', userController);

function userController($scope, $timeout, User, notificationFactory) {
    $scope.count = 1024;
    $scope.perc = 25.5;

    $scope.increment = function() {
      $scope.count++;
      $scope.perc += 0.3;
      if ($scope.count > 0) {
        $timeout($scope.increment, 1000);
      }
    };
    $scope.increment();

    // $scope.$watch("listOfUser", function(newValue, oldValue) {
    //     console.log(" mudou  " , newValue, oldValue);
    // });

    $scope.login = function() {
        $scope.listOfUser = User.query()
        console.log($scope.listOfUser.length);
        for (var i = 0; i < $scope.listOfUser.length; i++) {
            if ($scope.listOfUser[i].email === "email@email.com") {
                console.log($scope.userLoggedIn, 'oiiiiii');
                $scope.userLoggedIn = $scope.listOfUser[i];
            }
        }
        // angular.forEach($scope.listOfUser, function(user, key) {
        //   if (user.email === "email@email.com") {
        //     $scope.userLoggedIn = user;
        //   }
        // });
    }
}
