'use strict';

angular.module('lmisApp')
  .controller('HealthFacilityCtrl', function ($scope, $filter, utility, Auth, Pagination, Places) {
    $scope.products = [
      {product: "IPV", count: "15", uom: "doses", maximumLevel: "120", minimumLevel: "0", reorderLevel: "20"},
      {product: "Phytomenadione", count: "0", uom: "vials", maximumLevel: "50", minimumLevel: "2", reorderLevel: "5"},
      {product: "ADS 0.05ml", count: "120", uom: "doses", maximumLevel: "150", minimumLevel: "40", reorderLevel: "20"},
    ]
    $scope.count = 0;
    $scope.default = function (product) {return $scope.count == undefined;};
    $scope.green = function (product) {return $scope.count >= product.maximumLevel;};
    $scope.yellow = function (product) {return $scope.count < product.reorderLevel;};
    $scope.red = function (product) { return $scope.count < product.minimumLevel; };


    $scope.tabnumber = 1;
    $scope.showtab = function (tab) {
      $scope.tabnumber = tab;
    }
  });
