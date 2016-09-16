'use strict';

angular.module('lmisApp')
  .controller('HealthFacilityCtrl', function ($scope, $filter, utility, Auth, Pagination, Places) {
    $scope.products = [
      {product: "IPV", count: 15, uom: "doses", maximumLevel: 120, minimumLevel: 0, reorderLevel: 20},
      {product: "Phytomenadione", count: 0, uom: "vials", maximumLevel: 50, minimumLevel: 2, reorderLevel: 5},
      {product: "ADS 0.05ml", count: 120, uom: "doses", maximumLevel: 150, minimumLevel: 40, reorderLevel: 20},
      {product: "Hep B", count: 72, uom: "doses", maximumLevel: 240, minimumLevel: 40, reorderLevel: 10},
      {product: "Measles", count: 10, uom: "doses", maximumLevel: 100, minimumLevel: 0, reorderLevel: 10},
      {product: "Syringe", count: 480, uom: "units", maximumLevel: 70, minimumLevel: 100, reorderLevel: 125},
      {product: "MEN-A", count: 80, uom: "doses", maximumLevel: 70, minimumLevel: 10, reorderLevel: 12},
    ]
    $scope.count = 1;
    $scope.getClass = function (product) {
      if (!angular.isNumber(product.count)) {
        return 'status-grey'
      } else if (product.count > product.reorderLevel || product.count >= product.maximumLevel) {
        return 'status-green'
      } else if (product.minimumLevel < product.count && product.count <= product.reorderLevel) {
        return 'status-yellow'
      } else {
        return 'status-red'
      }
    }
    $scope.default = function (product) {return product.count === undefined;};
    $scope.green = function (product) {return product.count >= product.maximumLevel;};
    $scope.yellow = function (product) {return product.count <= product.reorderLevel;};
    $scope.red = function (product) {return product.count <= product.minimumLevel;};

    $scope.stockOut = [
      {product: "IPV", count: 15, uom: "doses", maximumLevel: 120, minimumLevel: 0, reorderLevel: 20},
      {product: "Phytomenadione", count: 0, uom: "vials", maximumLevel: 50, minimumLevel: 2, reorderLevel: 5},
      {product: "Hep B", count: 72, uom: "doses", maximumLevel: 240, minimumLevel: 40, reorderLevel: 10},
      {product: "Measles", count: 10, uom: "doses", maximumLevel: 100, minimumLevel: 0, reorderLevel: 10},
    ]

    $scope.wasteCount = [
      {reportDate: "12/08/2016", product: "OPV 10", reason: "Unopened expiry", quantity: "15 doses"},
      {reportDate: "09/08/2016", product: "Penta 10", reason: "VVM Stage 3", quantity: "10 doses"},
      {reportDate: "09/08/2016", product: "Measles 10", reason: "VVM Stage 4", quantity: "2 doses"},
      {reportDate: "04/08/2016", product: "Measles 10", reason: "Suspected freezing", quantity: "21 doses"}
    ]

    $scope.cce = [
      {model: "Dometic TCW-200 SDD", status: "working", fault: "none"},
    ]

    $scope.incoming = [
      {product: "YF 10", quantity: 10, uom: "vials", expiry: "18/10/2017", receivedFrom: "Dan Marke Health Facility", batchNumber: 947, received: "12/08/2016", recordedOn: "12/08/2016 16:33"},
      {product: "2ml Dil. Syringe", quantity: 115, uom: "units", expiry: "11/01/2018", receivedFrom: "Kunnawa Primary Health Facility", batchNumber: 050153, received: "12/08/2016", recordedOn: "12/08/2016 15:29"},
      {product: "Measles 10", quantity: 75, uom: "doses", expiry: "10/10/2019", receivedFrom: "Babba Riga Health Facility", batchNumber: "004M5113", received: "12/08/2016", recordedOn: "12/08/2016 15:11"},
      {product: "BCG 20", quantity: 20, uom: "vials", expiry: "30/05/2017", receivedFrom: "Dan Marke Health Facility", batchNumber: "037G5204", received: "12/08/2016", recordedOn: "12/08/2016 15:07"},
    ]

    $scope.outgoing = [
      {product: "YF 10", quantity: 10, uom: "vials", expiry: "18/10/2017", sentTo: "Dan Marke Health Facility", batchNumber: 947},
      {product: "2ml Dil. Syringe", quantity: 115, uom: "units", expiry: "11/01/2018", sentTo: "Kunnawa Health Facility", batchNumber: 050153},
      {product: "Measles 10", quantity: 75, uom: "doses", expiry: "10/10/2017", sentTo: "Babba Riga", batchNumber: "004M5113"},
      {product: "BCG 20", quantity: 20, uom: "vials", expiry: "18/06/2017", sentTo: "BHC Bantaje", batchNumber: "037G5204"},
    ]

    $scope.tabnumber = 1;
      $scope.showtab = function(tab) {
        $scope.tabnumber = tab;
      }
  });
