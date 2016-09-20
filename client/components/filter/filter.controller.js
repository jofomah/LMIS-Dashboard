'use strict';

angular.module('lmisApp')
  .controller('FilterCtrl', function ($scope, $location, $route, Auth, $filter, $window) {
    $scope.isFilterEdit = true;
    $scope.ranges = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    };


    $scope.datesRange = { startDate: moment().subtract(6, 'days'), endDate: moment() };

    jQuery('.daterange .dropdown-menu .form-control').on({
      "click": function (e) {
        e.stopPropagation();
      }
    });
  })