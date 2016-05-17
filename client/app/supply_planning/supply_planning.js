'use strict';

angular.module('lmisApp')
  .config(function ($routeProvider) {
      $routeProvider
        .when('/supply-planning', {
            templateUrl: 'app/supply_planning/supply_planning.html',
            controller: 'SupplyPlanningCtrl',
            authenticate: true,
            
        });
  })
.controller("SupplyPlanningCtrl", function ($scope, $http, Modal) {
    $scope.contents = null;
    $scope.assignmentContents = null;
    $http.get('app/supply_planning/assignment.json')
        .success(function (data) {
            $scope.assignmentContents = data;
        });
    $http.get('app/supply_planning/dummy.json')
        .success(function (data) {
            
            $scope.contents = data.Facility;
            
        });

    $http.get('app/supply_planning/vendors.json')
        .success(function (data) {
            $scope.vendorContents = data;
        });

    function getSelectedItem(value) {
        if (value.Id === this.id)
            return value;
    }
    
    $scope.showAllocationForm = function (id) {
      
        var obj = { id: id };
        var params = {
            templateUrl: 'app/supply_planning/stock_allocations/stock-allocation-form.html',
            controller: 'StockAllocationFormCtrl',
            size: 'lg',
            selectedItem: $scope.contents.filter(getSelectedItem,obj)
        }
        Modal.dialog(params)
        .then({

        })
        .catch({

        });
        
    };
    
});