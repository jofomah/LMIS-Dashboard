'use strict';

angular.module('lmisApp',
		[
			'config',
			'ngCookies',
			'ngResource',
			'ngSanitize',
			'ngRoute',
			'ngCsv',
			'nvd3ChartDirectives',
			'ui.bootstrap',
			'ui.select',
			'pwCheck',
			'remoteError',
			'alerts',
			'pagination',
			'leaflet-directive',
			'ui.grid',
			'ui.grid.pagination',
      'nvd3'
		])
		.config(function ($routeProvider, $locationProvider, $httpProvider, uiSelectConfig) {
			$routeProvider
					.otherwise({
						redirectTo: '/'
					});

			$locationProvider.html5Mode(true);
			$httpProvider.interceptors.push('authInterceptor');
			uiSelectConfig.theme = 'bootstrap';
		})

		.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
			return {
				// Add authorization token to headers
				request: function (config) {
					config.headers = config.headers || {};
					if ($cookieStore.get('token')) {
						config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
					}
					return config;
				},

				// Intercept 401s and redirect you to login
				responseError: function (response) {
					if (response.status === 401) {
						$rootScope.$emit('unauthorized');
						$location.path('/login');
						// remove any stale tokens
						$cookieStore.remove('token');
						return $q.reject(response);
					}
					else {
						return $q.reject(response);
					}
				}
			};
		}).factory("menuState", function () {

		  var menuState = {};
		  menuState.state = false;
		  menuState.maintain = function (state) {
		    if (state) {
		      jQuery('#sub-menu-div').animate({
		        top: "-280px"
		      }, 300, function () {
		      });
		      menuState.state = false;
		      jQuery('#menu-icon-collapse').hide();
		      jQuery('#menu-icon-expand').show();
		    } else {
		      jQuery('#sub-menu-div').animate({
		        top: "45px"
		      }, 300, function () {
		      });
		      menuState.state = true;
		      jQuery('#menu-icon-collapse').show();
		      jQuery('#menu-icon-expand').hide();
		    }
		  }

		  return menuState;
		})

		.run(function ($rootScope, $location, SETTINGS, utility, Alerts, Auth, State, Zone, LGA, Ward, Facility, menuState) {
			$rootScope.loadingView = true;
			$rootScope.loadViewError = false;
			$rootScope.SETTINGS = SETTINGS;
			$rootScope.getFileName = utility.getFileName;

			// alerts
			$rootScope.closeAlert = Alerts.close;

			// Redirect to login if route requires auth and you're not logged in
			$rootScope.$on('$routeChangeStart', function (event, next) {
				$rootScope.loadingView = true;
				$rootScope.loadViewError = false;
				Auth.isLoggedInAsync(function (loggedIn) {
					if (next.authenticate && !loggedIn) {
						$location.path('/login');
					}
				});
			});

			$rootScope.$on('$routeChangeSuccess', function (event) {
			  $rootScope.loadingView = false;
			  var mState = menuState;
			  mState.maintain(true);
			});

			$rootScope.$on('$routeChangeError', function (event) {
				$rootScope.loadingView = false;
				$rootScope.loadViewError = true;
			});

			$rootScope.dataProvider = {
				loadingStates: false,
				getStates: function (value) {
					this.loadingStates = true;
					return State.names(value)
							.finally(function () {
								this.loadingStates = false;
							}.bind(this));
				},
				loadingZones: false,
				getZones: function (value) {
					this.loadingZones = true;
					return Zone.names(value)
							.finally(function () {
								this.loadingZones = false;
							}.bind(this));
				},
				loadingLgas: false,
				getLgas: function (value) {
					this.loadingLgas = true;
					return LGA.names(value)
							.finally(function () {
								this.loadingLgas = false;
							}.bind(this));
				},
				loadingWards: false,
				getWards: function (value) {
					this.loadingWards = true;
					return Ward.names(value)
							.finally(function () {
								this.loadingWards = false;
							}.bind(this));
				},
				loadingFacilities: false,
				getFacilities: function (value) {
					this.loadingFacilities = true;
					return Facility.names(value)
							.finally(function () {
								this.loadingFacilities = false;
							}.bind(this));
				}
			};
		});