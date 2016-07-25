'use strict';

angular.module('lmisApp')
.controller("StockAllocationFormCtrl", function ($scope, $modalInstance, $http) {
      
    $scope.closeDialog = $modalInstance.dismiss;
    $scope.confirm = $modalInstance.close;
    $scope.IsDelivery = true;
    $http.get('app/supply_planning/vendors.json')
        .success(function (data) {

            $scope.vendors = data.Vendors;

        });
        
});