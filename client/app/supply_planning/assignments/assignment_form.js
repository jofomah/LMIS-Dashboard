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
.controller("StockAllocationFormCtrl", function ($scope, $modalInstance, $http) {
      
    $scope.closeDialog = $modalInstance.dismiss;
    $scope.confirm = $modalInstance.close;

    $http.get('app/supply_planning/vendors.json')
        .success(function (data) {

            $scope.vendors = data.Vendors;

        });
        
});