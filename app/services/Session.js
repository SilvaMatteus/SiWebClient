

app.factory('Auth', function(){

    return {

        setAuthentication: function (user) {
            sessionStorage.user = user;
        },

        isAuthenticated: function () {
            return (sessionStorage.user != null && sessionStorage.user != false);
        },

        logout: function(){
            sessionStorage.clear();
        }
    };

});