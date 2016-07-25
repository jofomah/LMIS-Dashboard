'use strict';

angular.module('lmisApp')
  .controller('LedgerCtrl', function($scope, $timeout, leafletData, Auth, Pagination, $filter, Places, bundleLines, productTypes, utility, UoMs) {
    var rows = bundleLines;
    var arrowPattern = {
      offset: '50%',
      repeat: 0,
      symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true, weight: 2}})
    };

    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.search = {};
    $scope.ledger = {filterType: 'Incoming Bundle'};
    $scope.totals = [];
    $scope.getFileName = utility.getFileName;
    $scope.csvHeader = [
      'State',
      'Sent From Zone',
      'Sent From LGA',
      'Sent From Ward',
      'Sent From',
      'Receiving Zone',
      'Receiving LGA',
      'Receiving Ward',
      'Receiving Facility',
      'Transaction Date',
      'Date Recorded',
      'Product Expiry Date',
      'Batch Number',
      'Product',
      'Quantity'
    ];
    $scope.UoMs = UoMs;

    $scope.map = {
      defaults: {
        maxZoom: 14,
        scrollWheelZoom: false
      },
      center: {},
      bounds: {},
      markers: {},
      paths: {
        lines: {
          weight: 2,
          type: 'multiPolyline',
          latlngs: []
        }
      },
      decorations: {}
    };

    $scope.place = {
      type: '',
      columnTitle: '',
      search: ''
    };

    $scope.from = {
      opened: false,
      date: moment().startOf('day').subtract(7, 'days').toDate(),
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

    $scope.created = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.receivedOn = {
      opened: false,
      date: moment().endOf('day').toDate(),
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.opened = true;
      }
    };

    $scope.expiryDate = {
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
      var ledgerExport = [];
      var totals = {};
      var filterBy = Places.propertyName($scope.place.type);
      var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
      var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
      var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);
      var filterType = angular.isUndefined($scope.ledger.filterType) ? 'Incoming Bundle' : $scope.ledger.filterType;

      var search = $scope.place.search.toLowerCase();
      $scope.filteredRows = rows.filter(function(row) {
        var date = moment(row.created);
        var include = true;

        if (include && $scope.ledger.filterType)
          include = include && $scope.ledger.filterType.toLowerCase() === row.type.toLowerCase();

        if (include && search && filterBy) {
          var placeName = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[filterBy] : row.sendingFacilityObject[filterBy];
          if (placeName === undefined)
            return false;

          include = include && placeName && (placeName.toLowerCase() === search);
        }

        if (include && $scope.from.date)
          include = include && (date.isSame($scope.from.date, 'day') || date.isAfter($scope.from.date));

        if (include && $scope.to.date)
          include = include && (date.isSame($scope.to.date, 'day') || date.isBefore($scope.to.date));

        return include;
      });

      var bounds = null;
      var lines = {};
      var markers = {};
      var decorations = {};
      $scope.filteredRows.forEach(function(row) {
        ledgerExport.push({
          state: row.receivingFacilityObject.state,
          sendingZone: row.sendingFacilityObject.zone,
          sendingLGA: row.sendingFacilityObject.lga,
          sendingWard: row.sendingFacilityObject.ward,
          sendingFacility: row.sendingFacilityObject.name,
          receivingZone: row.receivingFacilityObject.zone,
          receivingLGA: row.receivingFacilityObject.lga,
          receivingWard: row.receivingFacilityObject.ward,
          receivingFacility: row.receivingFacilityObject.name,
          transactionDate: row.receivedOn,
          created: row.created,
          expiry: row.expiryDate,
          product: row.productProfile,
          quantity: row.quantity
        });

        var key = filterType === 'Incoming Bundle' ? row.receivingFacilityObject[groupBy] : row.sendingFacilityObject[groupBy];
        totals[key] = totals[key] || {
          place: key,
          values: {}
        };

        var code = row.productCode;
        totals[key].values[code] = (totals[key].values[code] || 0) + row.quantity;

        var line = [];
        [row.sendingFacilityObject, row.receivingFacilityObject].forEach(function(facility) {
          var lat = facility.lat ? parseFloat(facility.lat) : NaN;
          var long = facility.long ? parseFloat(facility.long) : NaN;

          if (!isNaN(lat) && !isNaN(long)) {
            var latlng = L.latLng(lat, long);
            if (!bounds)
              bounds = L.latLngBounds(latlng, latlng);
            else
              bounds.extend(latlng);

            var point = {lat: lat, lng: long, message: facility.name, icon: {type: 'makiMarker', size: 's'}};
            markers[facility._id] = point;
            line.push(point);
          }
        });

        var lineKey = row.sendingFacilityObject._id + '-' + row.receivingFacilityObject._id;
        if (line.length == 2) {
          lines[lineKey] = line;
          decorations[lineKey] = {
            coordinates: [[line[0].lat, line[0].lng], [line[1].lat, line[1].lng]],
            patterns: [arrowPattern]
          }
        }
      });

      ledgerExport = $filter('orderBy')(ledgerExport, ['-created']);

      if (bounds) {
        bounds = bounds.pad(.01);
        $scope.map.bounds = {northEast: bounds.getNorthEast(), southWest: bounds.getSouthWest()};
      }

      $scope.map.markers = markers;
      $scope.map.paths.lines.latlngs = _.values(lines);
      $scope.map.decorations = {};
      $timeout(function() {
        $scope.map.decorations = decorations;
      }, 1000);

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
      $scope.export = ledgerExport;
      $scope.exportTitle = 'ledger-' + filterType.toLowerCase().replace(/\s/, '-');
    };

    $scope.getproductType = function (productType) {
      var product = $filter('filter')($scope.UoMs, { ProductType: productType })[0];
      return product.ProductType + " (" + product.UoM + 's)';
    }

    $scope.update();
  });
