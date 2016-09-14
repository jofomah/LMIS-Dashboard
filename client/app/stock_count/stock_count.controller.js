'use strict';

angular.module('lmisApp')
  .controller('StockCountCtrl', function ($scope, $filter, $routeParams, utility, Auth, Pagination, stockCounts, Places, productTypes, UoMs, $http) {
    var rows = stockCounts;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.productTypes = productTypes;
    $scope.pagination = new Pagination();
    $scope.filteredRows = [];
    $scope.totals = [];
    $scope.places = null;
    $scope.UoMs = UoMs;
    $scope.getFilename = utility.getFileName;
    $scope.chartTab = true;
    $scope.csvHeader = [
      'State',
      'Zone',
      'LGA',
      'Ward',
      'Facility',
      'Contact Name',
      'Contact Phone',
      'Product',
      'Count',
      'Due Date',
      'Record Date',
      'Modified Date'
    ];

    $scope.place = {
      type: '',
      columnTitle: '',
      search: ''
    };

    if ($routeParams.facility) {
      $scope.place = {
        type: Places.FACILITY,
        search: $routeParams.facility
      };
    }

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

    $scope.getPlaces = function(filter) {
      $scope.places = new Places($scope.place.type, filter);

      return $scope.places.promise;
    };

    $scope.update = function() {
      var unopenedExport = [];
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

        row.unopened.forEach(function(unopened) {
          unopenedExport.push({
            state: row.facility.state,
            zone: row.facility.zone,
            lga: row.facility.lga,
            ward: row.facility.ward,
            facility: row.facility.name,
            contactName: row.facility.contact.name,
            contactPhone: row.facility.phone,
            product: unopened.productType.code,
            count: unopened.count,
            countDate: row.countDate,
            created: row.created,
            modified: row.modified
          });

          var code = unopened.productType.code;
          totals[key].values[code] = (totals[key].values[code] || 0) + unopened.count;
        });
      });

      unopenedExport = $filter('orderBy')(unopenedExport, ['-created', 'product']);

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
      $scope.export = unopenedExport;
    };

    $scope.getproductType = function (productType) {
        var product = $filter('filter')($scope.UoMs, { ProductType: productType })[0];
        return product.ProductType + " (" + product.UoM + 's)';
    }

    $scope.update();


    //new  UI
    $scope.summaryOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          },
          maxKeyLength: 500,
          align: true,
          height: 250,
          padding: 50,
          rightAlign: false
        },
        height: 120,
        stacked: true,
        x: function (d) { return d.label; },
        y: function (d) { return d.value; },
        //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
        showControls: false,
        showValues: true,
        showXAxis: false,
        duration: 500,
        yAxis: {
          ticks: 10,
          tickFormat: function (d) { return d3.format(',p')(d / 100); }
        }
      }
    };

    $scope.summaryData = [
            {
              "key": "All antigens sufficient",
              "color": "#606060",
              "values": [
                  {
                    "label": "Summary",
                    "value": 60
                  }
              ]
            },
            {
              "key": "1-2 antigens below minimum",
              "color": "#a7a7a7",
              "values": [
                  {
                    "label": "Summary",
                    "value": 20
                  }
              ]
            },
            {
              "key": "3 or more antigens below minimum",
              "color": "#ff7e00",
              "values": [
                  {
                    "label": "Summary",
                    "value": 15
                  }
              ]
            },
            {
              "key": "LGAs that did not report",
              "color": "#af00d4",
              "values": [
                  {
                    "label": "Summary",
                    "value": 5
                  }
              ]
            }
    ];

    $scope.summaryDataInventory = [
            {
              "key": "All commodities sufficient",
              "color": "#01c256",
              "values": [
                  {
                    "label": "Summary",
                    "value": 60
                  }
              ]
            },
            {
              "key": "1-2 commodities below minimum",
              "color": "#f8e71c",
              "values": [
                  {
                    "label": "Summary",
                    "value": 20
                  }
              ]
            },
            {
              "key": "3 or more commodities below minimum",
              "color": "#f84324",
              "values": [
                  {
                    "label": "Summary",
                    "value": 15
                  }
              ]
            },
            {
              "key": "Non reporting",
              "color": "#D3D3D3",
              "values": [
                  {
                    "label": "Summary",
                    "value": 5
                  }
              ]
            }
    ];



    $scope.minOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 100,
        stacked: true,
        x: function (d) { return d.label; },
        y: function (d) { return d.value; },
        showControls: false,
        showValues: true,
        showXAxis: true,
        duration: 500,
        showLegend: false,
        yAxis: {
          ticks: 10,
          tickFormat: function (d) { return d3.format(',p')(d / 100); }
        }
      }
    };

    $http.get('app/sample_data/stock-count-lgas.json')
        .success(function (data) {
          $scope.lgas1 = [];
          $scope.lgas2 = [];
          for (var i = 0; i < data[0].LGAs.length; i++) {
            if (isEven(i)) {
              $scope.lgas1.push(data[0].LGAs[i]);
            } else {
              $scope.lgas2.push(data[0].LGAs[i]);
            }
          }
        });

    $scope.tabview = function (v) {
      $scope.chartTab = v;
    }

    function isEven(n) {
      return n % 2 == 0;
    }


  });
