/*
* Created by Matteus Silva
* github.com/silvamatteus
*/
app.factory("User", function UserFactory($resource) {
    return $resource("http://10.9.111.238:5000/users/:id", { id: '@id' },
        {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        }
    );
});
