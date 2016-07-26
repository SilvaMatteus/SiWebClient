app.controller('userController', userController);

function userController($scope, User, notificationFactory) {

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






    //
    // $scope.updateTodoModal = function(index) {
    //     $scope.todoUpdate = Todo.get({id: $scope.todoList[index].id});
    //     $('#updateModal').modal('toggle');
    // }
    //
    // $scope.update = function() {
    //     $scope.todoUpdate.$update(function() {
    //         $('#updateModal').modal('toggle');
    //         notificationFactory.showSuccess("To do updated sucessfully!", function(){});
    //         $scope.listTodo();
    //     }).catch(function(todo) {
    //         notificationFactory.showError("Erro trying to update To do!", function(){
    //             console.log(todo.data.error);
    //         });
    //     });
    // }
    //
    // $scope.delete = function(index) {
    //     $scope.entry = Todo.get({id: $scope.todoList[index].id}, function() {
    //         $scope.entry.$delete(function() {
    //             notificationFactory.showSuccess("To do deleted sucessfully!", function(){});
    //             $scope.listTodo();
    //         }).catch(function(todo) {
    //             notificationFactory.showError("Erro trying to delete To do!", function(){
    //                 console.log(todo.data.error);
    //             });
    //         });
    //     });
    // }
    //
    // $scope.listTodo = function() {
    //     $scope.todoList = Todo.query();
    // }

}
