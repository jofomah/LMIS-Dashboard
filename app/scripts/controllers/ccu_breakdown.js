'use strict';

angular.module('lmisApp')
  .controller('CCUBreakdownCtrl', function ($scope, $q, $filter, Pagination, Places, CCEI, ccuBreakdown) {
    $scope.rows = [];
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.pagination = new Pagination();
    $scope.totals = [];
    $scope.units = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.places = null;

    $scope.place = {
      type: 0,
      columnTitle: 'Zone',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract('days', 7).toDate(),
      open: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.to = {
      opened: false,
      date: moment().endOf('day').subtract('days', 1).toDate(),
      open: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.getPlaces = function (filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.updateTotals = function () {
      var totals = {};
      var filterBy = 'state';
      var groupBy = 'zone';
      var columnTitle = 'Zone';
      switch (parseInt($scope.place.type)) {
        case 1:
          filterBy = 'zone';
          groupBy = 'lga';
          columnTitle = 'LGA';
          break;
        case 2:
          filterBy = 'lga';
          groupBy = 'ward';
          columnTitle = 'Ward';
          break;
        case 3:
          filterBy = 'ward';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
        case 4:
          filterBy = 'facility';
          groupBy = 'facility';
          columnTitle = 'Facility';
          break;
      }

      if ($scope.place.search.length) {
        var search = $scope.place.search.toLowerCase();
        $scope.rows
          .filter(function (row) {
            var date = moment(row.created);
            return ((row[filterBy].toLowerCase() == search) &&
              (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date)) &&
              (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date)))
          })
          .forEach(function (row) {
            var key = row[groupBy];
            totals[key] = totals[key] || {
              place: key,
              values: {}
            };

            var value = totals[key].values[row.name] || 0;
            totals[key].values[row.name] = value + 1;
          });
      }

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function (key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.units.map(function (unit) {
            return (item.values[unit] || 0);
          })
        };
      });
    };

    $scope.$watch('search', function () {
      updateFilteredRows();
    }, true);

    function updateFilteredRows() {
      $scope.filteredRows = $filter('filter')($scope.rows, $scope.search);
      $scope.pagination.totalItemsChanged($scope.filteredRows.length);
    }

    $q.all([
        CCEI.names(),
        ccuBreakdown.byDate()
      ])
      .then(function (responses) {
        $scope.units = responses[0];

        var rows = responses[1];
        var startState = '';
        $scope.rows = rows
          .filter(function (row) {
            return !!row.facility;
          })
          .map(function (row) {
            if (!startState.length || row.facility.state < startState)
              startState = row.facility.state;

            return {
              state: row.facility.state,
              zone: row.facility.zone,
              lga: row.facility.lga,
              ward: row.facility.ward,
              facility: row.facility.name,
              created: row.created,
              name: row.name
            };
          });

        $scope.place.search = startState;
        $scope.updateTotals();
        updateFilteredRows();
      })
      .catch(function () {
        $scope.error = true;
      })
      .finally(function () {
        $scope.loading = false;
      });
  });