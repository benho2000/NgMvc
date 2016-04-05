var app = angular.module('angularTable', ['angularUtils.directives.dirPagination']);

app.controller('carCtrl', function ($scope, $http) {
    $scope.cars = []; //declare an empty array
    $http.get("/api/cars").success(function (response) {
        $scope.cars = response;  //ajax request to fetch data into $scope.data
        console.log(response);
    });

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});
