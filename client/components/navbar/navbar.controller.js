'use strict';

angular.module('lmisApp')
  .controller('NavbarCtrl', function ($scope, $location, $route, Auth, $filter, $window, menuState) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.menuState = menuState.state;

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
    $scope.toogleMenu = function () {
      $scope.menuState = menuState.state;
      menuState.maintain($scope.menuState);
      
    }
    
    jQuery(document).click(function () {
      menuState.state = true;
      $scope.toogleMenu();
    });

    jQuery('.bottom-handle').click(function (event) {
      event.stopPropagation();
    });
  });