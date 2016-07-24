var app = angular.module("readerApp", [
    'ui.router',
    'ngResource',
    'notification.fx'
]);

app.constant('context', "/");

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/app/login");

    $stateProvider
        .state('app.login', {
            url: '/login',
            templateUrl: '/views/login.html'
        })
        .state('app', {
            url: '/app',
            templateUrl: '/views/template.html'
        })
        .state('app.home', {
            url: '/home',
            templateUrl: '/views/home.html'
        })
        .state('app.register', {
            url: '/register',
            templateUrl: '/views/register.html'
        });
});
