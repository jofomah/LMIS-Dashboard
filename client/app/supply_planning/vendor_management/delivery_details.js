'use strict';

angular.module('lmisApp')
.controller("DeliveryDetailsDialogCtrl", function ($scope, $http, $modalInstance) {

    $scope.closeDialog = $modalInstance.dismiss;
    $scope.oneAtATime = true;
    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };

});