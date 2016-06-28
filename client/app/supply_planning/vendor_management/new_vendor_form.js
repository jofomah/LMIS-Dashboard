'use strict';

angular.module('lmisApp')
.controller("NewVendorFormCtrl", function ($scope, $http, $modalInstance) {
      
    $scope.closeDialog = $modalInstance.dismiss;
    $scope.confirm = $modalInstance.close;
          
});