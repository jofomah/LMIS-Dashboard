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
.controller("SupplyPlanningCtrl", function ($scope, $http) {
    debugger
    $scope.contents = null;
    $scope.assignmentContents = null;
    $http.get('app/supply_planning/assignment.json')
        .success(function (data) {
            $scope.assignmentContents = data;
        });
    $http.get('app/supply_planning/dummy.json')
        .success(function (data) {
            $scope.contents = data;
        });

    $http.get('app/supply_planning/vendors.json')
        .success(function (data) {
            $scope.vendorContents = data;
        });
    
    $scope.showAllocationForm = function () {
        $scope.State = cRow.State;
        $modal.open({
            templateUrl: 'app/supply_planning/stock_allocations/stock-allocation-form.html',
            controller: 'StockAllocationFormCtrl'
        });
    };
});