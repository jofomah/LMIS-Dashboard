'use strict';

angular.module('lmisApp')
  .factory('Location', function ($rootScope, $http) {
    var URL = '/api/location';
    var allPromise = null;

    $rootScope.$on('currentUserChanged', function () {
      allPromise = null;
    });

    return {
      /**
       * return all the locations
       */
      all: function (reload) {
        if (!reload && allPromise) {
          return allPromise;
        }
        return $http.get(URL)
          .then(function (response) {
            return response.data
          });
      }
    };
  });
