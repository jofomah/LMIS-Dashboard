'use strict';

angular.module('lmisApp')
  .config(function ($routeProvider) {
      $routeProvider
        .when('/vendor-management', {
            templateUrl: 'app/supply_planning/vendor_management/vendors.html',
            controller: 'VendorManagementCtrl',
            authenticate: true,

        });
  })
.controller("VendorManagementCtrl", function ($scope, $http, Modal) {
      

    $http.get('app/supply_planning/vendors.json')
        .success(function (data) {

            $scope.vendors = data.Vendors;

        });

    $scope.showConfirmation = function () {
        var params = {
            modalBodyText: "Are you sure you want to delete this vendor?",
            modalHeader: "Confirmation",
            size: "sm"
        }
        Modal.dialog(params)
        .then({

        })
        .catch({

        });
    };

    $scope.showDeliveryDetails = function () {
        var params = {
            templateUrl: 'app/supply_planning/vendor_management/delivery_details.html',
            controller: 'DeliveryDetailsDialogCtrl',
            size: 'lg',
        }
        Modal.dialog(params)
        .then({

        })
        .catch({

        });
    };

    $scope.showNewVendor = function () {
        
        var params = {
            templateUrl: 'app/supply_planning/vendor_management/new_vendor_form.html',
            controller: 'NewVendorFormCtrl',
            size: 'md',
        }
        Modal.dialog(params)
        .then({

        })
        .catch({

        });
    };
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