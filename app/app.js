var app = angular.module("readerApp", [
    'ui.router',
    'ngResource',
    'notification.fx',
    'hc.marked'
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
            controller:'userController',
            url: '/app',
            templateUrl: '/views/template.html'
        })
        .state('app.home', {
            url: '/home',
            templateUrl: '/views/home.html'
        })
        .state('app.register', {
            controller:'registerController',
            url: '/register',
            templateUrl: '/views/register.html'
        });
});
