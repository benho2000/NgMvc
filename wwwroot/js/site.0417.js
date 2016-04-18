var app = angular.module('angularTable', ['angularUtils.directives.dirPagination', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination', 'trNgGrid', 'dx', 'angularModalService', 'ngAnimate']);

app.controller('carCtrl', function ($scope, $http) {

    $scope.cars = []; //declare an empty array

    $http.get("/api/cars").success(function (response) {
        $scope.cars = response;  //ajax request to fetch data into $scope.data
        console.log(response);
    });

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

});

app.controller('carGridController', ['$scope', '$http', function ($scope, $http) {

    $scope.carGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApiNames = gridApi;
        },
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
                        { name: 'Id' },
                        { name: 'Make' },
                        { name: 'Year' },
                        { name: 'Status' }
        ]
    };

    $http.get('http://localhost:24099/api/cars')
  .success(function (data) {
      $scope.carGrid.data = data;
  });
}]);

app.controller("trnggridCtrl", ["$scope", "$http", "ModalService", function ($scope, $http, ModalService) {
    $scope.disableScheduleButton = true;
    $scope.showModal = false;
    $scope.showChildTable = false;
    $scope.makeDropdownOptions = ["Honda", "Toyota", "Ford", "Lexus", "Mazada", "Kia", "Jeep"];

    $scope.mySelectedItems = [];
    //$scope.myGlobalFilter = ''; // no need to define this

    function init() {
        $http.get('http://localhost:24099/api/cars')
            .success(function (data) {
                $scope.myItems = data;
                $scope.myCars = data;
            });
    }

    $scope.$watch("myMasterGlobalFilter", function () {
        console.log("my masater global filter: " + $scope.myGlobalFilter);
    });

    $scope.$watchCollection("mySelectedItems", function () {
        // your logic goes here
        console.log("num of selected: " + $scope.mySelectedItems.length);
        console.log("data: " + JSON.stringify($scope.mySelectedItems));

        if ($scope.mySelectedItems.length > 0) {
            $scope.disableScheduleButton = false;
            $scope.showChildTable = true;
        }
        else {
            $scope.disableScheduleButton = true;
            $scope.showChildTable = false;
        }

    });

    $scope.OnScheduleClicked = function () {

        //console.log(JSON.stringify($scope.mySelectedItems));

        // send data back to server
        if ($scope.mySelectedItems.length > 0) {
            console.log("data to send back: " + JSON.stringify($scope.mySelectedItems));
        }
    };

    $scope.OnRefresh = function ($scope, $http) {
        init();
    };


    $scope.OnRemoveFilter = function () {
        $scope.myGlobalFilter = '';
        $scope.myColumnFilter = '';
        init();
    };

    $scope.OnUnselect = function () {
        $scope.mySelectedItems = [];
    };

    $scope.OnItemButtonClick = function (id) {
        console.log("id of row clicked: " + id);
    }

    //$scope.OnSelectedItemEditClick = function (id) {
    //    console.log("id of selected item row clicked: " + id);
    //}    

    $scope.OnSelectedItemEditClick = function (id) {

        console.log("id of selected item row clicked: " + id);

        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                //$scope.message = "You said " + result;
            });
        });
    };

    init();
}]);

app.controller('ModalController', function ($scope, close) {

    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

});

app.controller('dxCtrl', function ($scope, $http) {

    //$scope.cars = []; //declare an empty array

    //$http.get("/api/cars").success(function (response) {
    //    $scope.cars = response;  //ajax request to fetch data into $scope.data
    //    console.log(response);
    //});

    var gridDataSource = {
        load: function (loadOptions) {

            var d = new $.Deferred();
            $.getJSON("http://localhost:24099/api/cars", function (data) {
                d.resolve(data, { totalCount: data.length });
            });
            return d.promise();
        },
        update: function (key, values) {
            //Updating data
        },
        insert: function (values) {
            //Inserting data
        },
        remove: function (key) {
            //Deleting data
        }
    }

    $scope.gridSettings = {
        dataSource: gridDataSource,
        paging: {
            pageSize: 6
        },
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        editing: {
            editMode: 'row',
            editEnabled: true,
            removeEnabled: true,
            insertEnabled: true

        }
    }

});

app.filter("computedMakes", function () {
    return function (fieldValueUnusedForComputedFields, dataItem) {
        return dataItem.Make.join(",");
    };
});
