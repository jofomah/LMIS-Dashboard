'use strict';

angular.module('lmisApp')
  .controller('NavbarCtrl', function ($scope, $location, $route, Auth, $filter, $window) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $route.reload()
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    function updateTime () {
      $scope.lastUpdated = $filter('date')(new Date(), 'MMM d, y h:mm a');
    }

    updateTime();

    $scope.$on('$routeChangeSuccess', updateTime);

    $scope.reloadPage = function () {
      $window.location.reload()
    }

    $scope.menuState = false;
    $scope.toogleMenu = function () {
      if ($scope.menuState) {
        jQuery('#sub-menu-div').animate({
          top: "-280px"
        }, 300, function() {
          // Animation complete.
        });
        $scope.menuState = false;
      } else {
        jQuery('#sub-menu-div').animate({
          top: "45px"
        }, 300, function () {
          // Animation complete.
        });
        $scope.menuState = true;
      }
    }
  });