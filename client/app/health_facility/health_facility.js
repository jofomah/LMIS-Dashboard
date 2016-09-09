'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/health-facility', {
        templateUrl: 'app/health_facility/health_facility.html',
        controller: 'healthFacilityCtrl',
        authenticate: true
      });
  });