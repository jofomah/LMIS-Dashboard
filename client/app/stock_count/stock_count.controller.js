'use strict';

angular.module('lmisApp')
  .controller('StockCountCtrl', function ($scope, $filter, $routeParams, utility, Auth, Pagination, /*stockCounts, Places, productTypes, UoMs, */ $http) {
    //var rows = stockCounts;
    $scope.currentUser = Auth.getCurrentUser();
    //$scope.productTypes = productTypes;
    //$scope.pagination = new Pagination();
    //$scope.filteredRows = [];
    //$scope.totals = [];
    //$scope.places = null;
    //$scope.UoMs = UoMs;
    //$scope.getFilename = utility.getFileName;
    $scope.chartTab = true;
    //$scope.csvHeader = [
    //  'State',
    //  'Zone',
    //  'LGA',
    //  'Ward',
    //  'Facility',
    //  'Contact Name',
    //  'Contact Phone',
    //  'Product',
    //  'Count',
    //  'Due Date',
    //  'Record Date',
    //  'Modified Date'
    //];

    //$scope.place = {
    //  type: '',
    //  columnTitle: '',
    //  search: ''
    //};

    //if ($routeParams.facility) {
    //  $scope.place = {
    //    type: Places.FACILITY,
    //    search: $routeParams.facility
    //  };
    //}

    //$scope.from = {
    //  opened: false,
    //  date: moment().startOf('day').subtract(7, 'days').toDate(),
    //  open: function($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    this.opened = true;
    //  }
    //};

    //$scope.to = {
    //  opened: false,
    //  date: moment().endOf('day').toDate(),
    //  open: function($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    this.opened = true;
    //  }
    //};

    //$scope.getPlaces = function(filter) {
    //  $scope.places = new Places($scope.place.type, filter);

    //  return $scope.places.promise;
    //};

    //$scope.update = function() {
    //  var unopenedExport = [];
    //  var totals = {};
    //  var filterBy = Places.propertyName($scope.place.type);
    //  var subType = $scope.place.type === Places.FACILITY ? Places.FACILITY : Places.subType($scope.place.type);
    //  var groupBy = Places.propertyName(subType || $scope.currentUser.access.level);
    //  var columnTitle = Places.typeName(subType || $scope.currentUser.access.level);

    //  $scope.filteredRows = utility.placeDateFilter(rows, filterBy, $scope.place.search, $scope.from.date, $scope.to.date);
    //  $scope.filteredRows.forEach(function(row) {
    //    var key = row.facility[groupBy];
    //    totals[key] = totals[key] || {
    //      place: key,
    //      values: {}
    //    };

    //    row.unopened.forEach(function(unopened) {
    //      unopenedExport.push({
    //        state: row.facility.state,
    //        zone: row.facility.zone,
    //        lga: row.facility.lga,
    //        ward: row.facility.ward,
    //        facility: row.facility.name,
    //        contactName: row.facility.contact.name,
    //        contactPhone: row.facility.phone,
    //        product: unopened.productType.code,
    //        count: unopened.count,
    //        countDate: row.countDate,
    //        created: row.created,
    //        modified: row.modified
    //      });

    //      var code = unopened.productType.code;
    //      totals[key].values[code] = (totals[key].values[code] || 0) + unopened.count;
    //    });
    //  });

    //  unopenedExport = $filter('orderBy')(unopenedExport, ['-created', 'product']);

    //  $scope.place.columnTitle = columnTitle;
    //  $scope.totals = Object.keys(totals).map(function(key) {
    //    var item = totals[key];
    //    return {
    //      place: item.place,
    //      values: $scope.productTypes.map(function(productType) {
    //        return (item.values[productType] || 0);
    //      })
    //    };
    //  });

    //  $scope.pagination.totalItems = $scope.filteredRows.length;
    //  $scope.export = unopenedExport;
    //};

    //$scope.getproductType = function (productType) {
    //    var product = $filter('filter')($scope.UoMs, { ProductType: productType })[0];
    //    return product.ProductType + " (" + product.UoM + 's)';
    //}

    //$scope.update();


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

    var sdata = [
  {
    "LGAs": [
      {
        "Name": "Wakami Dogo",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "Wakami Dogo",
                "value": 30
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "Wakami Dogo",
                "value": 40
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "Wakami Dogo",
                "value": 20
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "Wakami Dogo",
                "value": 10
              }
            ]
          }
        ]
      },
      {
        "Name": "Sabon Dutse",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "Sabon Dutse",
                "value": 56
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "Sabon Dutse",
                "value": 15
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "Sabon Dutse",
                "value": 24
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "Sabon Dutse",
                "value": 5
              }
            ]
          }
        ]
      },
      {
        "Name": "Forest Plain",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "Forest Plain",
                "value": 20
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "Forest Plain",
                "value": 40
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "Forest Plain",
                "value": 30
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "Forest Plain",
                "value": 10
              }
            ]
          }
        ]
      },
      {
        "Name": "River Lands",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "River Lands",
                "value": 55
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "River Lands",
                "value": 22
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "River Lands",
                "value": 15
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "River Lands",
                "value": 8
              }
            ]
          }
        ]
      },
      {
        "Name": "Port Reach",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "Port Reach",
                "value": 79
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "Port Reach",
                "value": 1
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "Port Reach",
                "value": 18
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "Port Reach",
                "value": 2
              }
            ]
          }
        ]
      },
      {
        "Name": "Breach Trone",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "Breach Trone",
                "value": 30
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "Breach Trone",
                "value": 20
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "Breach Trone",
                "value": 10
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "Breach Trone",
                "value": 40
              }
            ]
          }
        ]
      },
      {
        "Name": "Lome Gida",
        "data": [
          {
            "key": "All antigens sufficient",
            "color": "#01c256",
            "values": [
              {
                "label": "Lome Gida",
                "value": 90
              }
            ]
          },
          {
            "key": "1-2 antigens below minimum",
            "color": "#f8e71c",
            "values": [
              {
                "label": "Lome Gida",
                "value": 5
              }
            ]
          },
          {
            "key": "3 or more antigens below minimum",
            "color": "#f84324",
            "values": [
              {
                "label": "Lome Gida",
                "value": 3
              }
            ]
          },
          {
            "key": "LGAs that did not report",
            "color": "#D3D3D3",
            "values": [
              {
                "label": "Lome Gida",
                "value": 2
              }
            ]
          }
        ]
      }
    ]
  }
    ];
          $scope.lgas1 = [];
          $scope.lgas2 = [];
          for (var i = 0; i < sdata[0].LGAs.length; i++) {
            if (isEven(i)) {
              $scope.lgas1.push(sdata[0].LGAs[i]);
            } else {
              $scope.lgas2.push(sdata[0].LGAs[i]);
            }
          }

    $scope.tabview = function (v) {
      $scope.chartTab = v;
    }

    function isEven(n) {
      return n % 2 == 0;
    }




    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isCustomHeaderOpen: false,
      isFirstOpen: true,
      isFirstDisabled: false
    };

    var slist = [
  {
    "Facilities": [
      {
        "Name": "Dakuwa General Hospital",
        "Location": "Nassarawa | Kano",
        "LowStock": 6,
        "LastCount": "Sep 24, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Wuye Federal Teaching Hospital",
        "Location": "Samarun | Gwali | Kano",
        "LowStock": 0,
        "LastCount": "Sep 23, 2016",
        "Products": [
          {

          }
        ]
      },
      {
        "Name": "Middle of Nowhere Health Facility",
        "Location": "Townsville | West Point | Abuja",
        "LowStock": 2,
        "LastCount": "Sep 12, 2016",
        "Products": [
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          }
        ]
      },
      {
        "Name": "Some Health Post",
        "Location": "Mile 4 | Kano",
        "LowStock": 1,
        "LastCount": "Sep 21, 2016",
        "Products": [
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Nigerian Army Regimental Hospital",
        "Location": "Kaduna North | Kaduna",
        "LowStock": 0,
        "LastCount": "Sep 28, 2016",
        "Products": [
          {

          }
        ]
      },
      {
        "Name": "Facility Number One",
        "Location": "Daura | Kano",
        "LowStock": 4,
        "LastCount": "Sep 24, 2016",
        "Products": [

          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Health Facility Number Two",
        "Location": "Port 5 | Kano",
        "LowStock": 12,
        "LastCount": "Sep 11, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          },
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Health Facility Number Three",
        "Location": "Tamper soils | Kwara",
        "LowStock": 6,
        "LastCount": "Sep 27, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Health Facility Number Four",
        "Location": "Suleja | Niger",
        "LowStock": 2,
        "LastCount": "Sep 24, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          }
        ]
      },
      {
        "Name": "Dakuwa General Hospital",
        "Location": "Nassarawa | Kano",
        "LowStock": 6,
        "LastCount": "Sep 24, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Wuye Federal Teaching Hospital",
        "Location": "Samarun | Gwali | Kano",
        "LowStock": 0,
        "LastCount": "Sep 23, 2016",
        "Products": [
          {

          }
        ]
      },
      {
        "Name": "Middle of Nowhere Health Facility",
        "Location": "Townsville | West Point | Abuja",
        "LowStock": 2,
        "LastCount": "Sep 12, 2016",
        "Products": [
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          }
        ]
      },
      {
        "Name": "Some Health Post",
        "Location": "Mile 4 | Kano",
        "LowStock": 1,
        "LastCount": "Sep 21, 2016",
        "Products": [
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Nigerian Army Regimental Hospital",
        "Location": "Kaduna North | Kaduna",
        "LowStock": 0,
        "LastCount": "Sep 28, 2016",
        "Products": [
          {

          }
        ]
      },
      {
        "Name": "Facility Number One",
        "Location": "Daura | Kano",
        "LowStock": 4,
        "LastCount": "Sep 24, 2016",
        "Products": [

          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Health Facility Number Two",
        "Location": "Port 5 | Kano",
        "LowStock": 12,
        "LastCount": "Sep 11, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          },
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Health Facility Number Three",
        "Location": "Tamper soils | Kwara",
        "LowStock": 6,
        "LastCount": "Sep 27, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          },
          {
            "Name": "HJO",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 40
          },
          {
            "Name": "IP",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 4
          },
          {
            "Name": "FG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 55
          }
        ]
      },
      {
        "Name": "Health Facility Number Four",
        "Location": "Suleja | Niger",
        "LowStock": 2,
        "LastCount": "Sep 24, 2016",
        "Products": [
          {
            "Name": "BCG",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 100
          },
          {
            "Name": "HPV",
            "UoM": "Doses",
            "Max": 220,
            "Reorder": 50,
            "Min": 20,
            "Current": 10
          }
        ]
      }

    ]
  }
    ];
    $scope.facilityList = slist[0].Facilities;
          $scope.nb = $scope.facilityList.length;
          var sel = { selected: false };
          for (var i = 0; i < $scope.facilityList.length; i++) {
            $scope.facilityList[i].Selected = false;
          }

    $scope.isWarning = function (lowstock) {
      if (lowstock > 0 && lowstock < 3) {
        return true;
      } else {
        return false;
      }
    }

    $scope.isWarningProduct = function (product) {
      if (product.Current <= product.Reorder && product.Current > product.Min) {
        return true;

      } else {
        return false;
      }
    }

    $scope.checkboxClick = function (facility, $event) {
      $event.stopPropagation();
    }

    $scope.showcount = function () {
      $scope.nb = $filter('filter')($scope.facilityList, $scope.searchText).length;
    }

    $scope.selectall = function () {
      if ($scope.sAll) {
        for (var i = 0; i < $scope.facilityList.length; i++) {
          $scope.facilityList[i].Selected = true;
        }
      } else {
        for (var i = 0; i < $scope.facilityList.length; i++) {
          $scope.facilityList[i].Selected = false;
        }
      }
    }

  });
