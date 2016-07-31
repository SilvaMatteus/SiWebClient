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

    $scope.login = function() {




        // this.listOfUser = User.query();
        // for (var i = 0; i < this.listOfUser.length; i++) {
        //     if (this.listOfUser[i].email == 'email@email.com') {
        //         $scope.userLoggedIn = this.listOfUser[i];
        //     }
        // }

    }
}
