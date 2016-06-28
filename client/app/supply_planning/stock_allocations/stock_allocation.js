'use strict';

angular.module('lmisApp')
    .config(function ($routeProvider) {
        $routeProvider
          .when('/stock-allocation', {
              templateUrl: 'app/supply_planning/stock_allocations/stock_allocation.html',
              controller: 'StockAllocationCtrl',
              authenticate: true,

          });
    })
.controller("StockAllocationCtrl", function ($scope, $http, Modal) {
      
    $http.get('app/supply_planning/dummy.json')
       .success(function (data) {

           $scope.contents = data.Facility;

       });
    $http.get('app/supply_planning/allocations_data.json')
      .success(function (data) {

          $scope.POcontents = data.PO;

      });
    $scope.showAllocationForm = function (id) {

        var obj = { id: id };
        var params = {
            templateUrl: 'app/supply_planning/stock_allocations/stock-allocation-form.html',
            controller: 'StockAllocationFormCtrl',
            size: 'lg',
            selectedItem: $scope.contents.filter(getSelectedItem, obj)
        }
        Modal.dialog(params)
        .then({

        })
        .catch({

        });

    };
    function getSelectedItem(value) {
        if (value.Id === this.id)
            return value;
    }
    $scope.from = {
        opened: false,
        date: moment().startOf('day').subtract(7, 'days').toDate(),
        open: function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.opened = true;
        }
    };

    $scope.to = {
        opened: false,
        date: moment().endOf('day').toDate(),
        open: function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.opened = true;
        }
    };
        
});