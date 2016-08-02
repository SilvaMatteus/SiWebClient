

app.factory('Session', function(){

    return {

        setAuthentication: function (user) {
            sessionStorage.user = JSON.stringify(user);
        },

        isAuthenticated: function () {
            return (sessionStorage.user != null && sessionStorage.user != false);
        },

        logout: function(){
            sessionStorage.clear();
        },

        getName: function(){
            return sessionStorage.user.name = JSON.parse(sessionStorage.user).name;
        }
    };

});