var app = angular.module("readerApp", [
    'ui.router',
    'ngResource',
    'notification.fx',
    'hc.marked',
    'TreeWidget'
]);

app.constant('context', "/");

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/app/login");

    $stateProvider
        .state('app.login', {
            url: '/login',
            templateUrl: '/views/login.html',
            controller: 'loginController',
            authenticate: false
        })
        .state('app', {
            url: '/app',
            templateUrl: '/views/template.html',
            controller: 'loginController',
            authenticate: false
        })
        .state('app.home', {
            url: '/home',
            templateUrl: '/views/home.html',
            controller: 'homeController',
            authenticate: true
        })
        .state('app.register', {
            url: '/register',
            templateUrl: '/views/register.html',
            controller:'registerController'
        });

});

app.run(function ($rootScope, $state, Session) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        if (toState.authenticate && !Session.isAuthenticated()) {
            $state.transitionTo("app.login");
            event.preventDefault();
        }

        if (!toState.authenticate && Session.isAuthenticated()) {
            $state.transitionTo("app.home");
            event.preventDefault();
        }

    });
});


