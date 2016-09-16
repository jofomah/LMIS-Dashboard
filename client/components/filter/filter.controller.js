﻿'use strict';

angular.module('lmisApp')
  .controller('FilterCtrl', function ($scope, $location, $route, Auth, $filter, $window) {
    $scope.isFilterEdit = true;

    jQuery('#dateselector').daterangepicker();


    var start = moment().subtract(6, 'days');
    var end = moment();

    function cb(start, end) {
      jQuery('#dateselector span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
    }

    jQuery('#dateselector').daterangepicker({
      startDate: start,
      endDate: end,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    }, cb);

    cb(start, end);

    jQuery('.daterange .dropdown-menu .form-control').on({
      "click": function (e) {
        e.stopPropagation();
      }
    });
  })