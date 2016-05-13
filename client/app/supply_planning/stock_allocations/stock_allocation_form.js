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
.controller("StockAllocationFormCtrl", function ($scope, $http, $modal) {
    debugger
   
    $scope.selectedFacility = null;
    $http.get('app/supply_planning/assignment.json')
        .success(function (data) {
            $scope.assignmentContents = data;
        });
   
    
});