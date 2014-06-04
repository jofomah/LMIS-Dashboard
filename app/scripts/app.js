'use strict';

angular
  .module('lmisApp', [
    'ngSanitize',
    'ngRoute',
    'pouchdb',
    'nvd3ChartDirectives'
  ])
  .constant('SETTINGS', {
    dbUrl: 'http://dev.lomis.ehealth.org.ng:5984/'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          facilities: ['Facility', function(Facility) {
            return Facility.all();
          }],
          productProfiles: ['ProductProfile', function(ProductProfile) {
            return ProductProfile.all();
          }],
          productTypes: ['ProductType', function(ProductType) {
            return ProductType.all();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('NavBar', function ($scope, $location) {
    $scope.isActive = function (url) {
      return url == $location.path();
    }
  });
