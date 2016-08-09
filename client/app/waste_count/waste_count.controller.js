'use strict';

angular.module('lmisApp')
  .controller('WasteCountCtrl', function ($scope, Auth, Pagination, $filter, utility, Places, productTypes, wasteCounts, UoMs) {
    var rows = wasteCounts;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.pagination = new Pagination();
    $scope.productTypes = productTypes;
    $scope.filteredRows = [];
    $scope.UoMs = UoMs;
    $scope.totals = [];
    $scope.places = null;
    $scope.getFilename = utility.getFileName;
    $scope.csvHeader = [
      'State',
      'Zone',
      'LGA',
      'Ward',
      'Facility',
      'Created Date',
      'Product',
      'Reason',
      'Quantity'
    ];

    $scope.place = {
      type: '',
      columnTitle: '',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract(30, 'days').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.to = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.getPlaces = function(filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.update = function() {
      var wasteCountExport = [];
      var totals = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);

      $scope.filteredRows = utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date);
      $scope.filteredRows.forEach(function(row) {
        var key = row.facility[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        row.reasons.forEach(function(reason) {
          wasteCountExport.push({
            state: row.facility.state,
            zone: row.facility.zone,
            lga: row.facility.lga,
            ward: row.facility.ward,
            facility: row.facility.name,
            created: row.created,
            product: reason.productProfile,
            reason: reason.reason,
            count: reason.value
          });

          var code = reason.productType;
          var newvalue = reason.value;
          if (reason.uom === 'vial' || reason.uom === 'Vial') {
            newvalue = newvalue * reason.multiplier;
          }
          totals[key].values[code] = (totals[key].values[code] || 0) + newvalue;
        });
      });

      wasteCountExport = $filter('orderBy')(wasteCountExport, ['-created']);

      $scope.place.columnTitle = columnTitle;
      $scope.totals = Object.keys(totals).map(function(key) {
        var item = totals[key];
        return {
          place: item.place,
          values: $scope.productTypes.map(function(productType) {
            return (item.values[productType] || 0);
          })
        };
      });

      $scope.pagination.totalItems = $scope.filteredRows.length;
      $scope.export = wasteCountExport;
    };

    $scope.getproductType = function (productType) {
      var product = $filter('filter')($scope.UoMs, { ProductType: productType })[0];
      return product.ProductType + " (" + product.UoM + 's)';
    }

    $scope.getValue = function (item) {
      var newvalue = item.value;
      var newuom = item.uom;
      if (newuom === 'vial' || newuom === 'Vial') {
        newvalue = newvalue * item.multiplier;
        newuom = 'Dose';
      }
      if (newvalue !== 1) {
        newuom = newuom + 's'
      }

      return newvalue + ' ' + newuom;
    }
    
    $scope.update();
  });
