'use strict';

var StockCount = require('./stock_count.model');
var Facility = require('../facility/facility.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// for generating fake values
var Chance = require('chance');
var chance = new Chance();

// get list of stock counts
exports.index = function(req, res, next) {
  StockCount.all(function(err, stockCounts) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, stockCounts, 'facility'));
  });
};

// 'unopened' db view data arranged by facility and date
exports.unopened = function(req, res, next) {
  StockCount.unopened(function(err, unopened) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, unopened, 'facility'));
  });
};


// get list of stock counts
exports.inDateRange = function(req, res, next) {
  StockCount.getWithin(req.query.start, req.query.end, function(err, stockCounts) {
    if (err) return next(err);

    res.json(auth.filterByFacilities(req, stockCounts, 'facility'));
  });
};

exports.by = function (req, res, next) {
  // function byLocation (options, cb) {
  // get all facilities within a given location
  var options = {
    key: req.params.locationId,
    include_docs: true
  };
  //TODO: Check if user is allowed to see for this location, else return access restriction error message
  Facility.byLocation(options, function (err, facilities) {
    if (err) {
      return next(err)
    }
    var startDateInMilliSec = new Date(req.params.startDate).getTime()
    var endDateInMilliSec = new Date(req.params.endDate).getTime()

    var startKey = [req.params.programId, startDateInMilliSec]
    var endKey = [req.params.programId, endDateInMilliSec, '\ufff0']
    var queryOption = {
      startkey: startKey,
      endkey: endKey,
      include_docs: true
    }
    StockCount.getBy(queryOption, function (err, stockCounts) {
      if (err) {
        return next(err)
      }
      var latestStockCountByFacilityId = {}
      stockCounts.forEach(function (stockCount) {
        var facilityId = stockCount.facilityId || 'unknown'
        latestStockCountByFacilityId[facilityId] = stockCount
      })

      var response = {
        adminLocationId: req.params.locationId,
        from: req.params.startDate,
        to: req.params.endDate,
        programId: req.params.programId,
        facilityStockCounts: []
      }

      var trackAlreadyPickedFacilityCounts = []
      // return latest stock count at each facility and only those that has stock count for the given program.
      facilities.forEach(function (facility) {
        var latestFacilityProgramStockCount = latestStockCountByFacilityId[facility._id]
        // add only if stock count exists and not already added for given facility
        if (latestFacilityProgramStockCount && trackAlreadyPickedFacilityCounts.indexOf(facility._id) === -1) {
          var belowReorder = 0
          var facilityStockReport = {
            facility: {
              name: facility.name,
              _id: facility._id
            },
            productCounts: latestFacilityProgramStockCount.productCounts.map(function (prodCount) {
              // TODO: replace with product profile aggregate since stock count is by product profile
              var min = chance.integer({min: 20, max: 50})
              var reorder = chance.integer({min: min, max: (min * 2) })
              var maxLowerBound = (prodCount.count && prodCount.count === 'number' && prodCount.count > reorder)? prodCount.count : reorder
              var max = chance.integer({min: maxLowerBound, max: parseInt(maxLowerBound * 1.8) })
              if (prodCount && typeof prodCount.count === 'number' && prodCount.count < reorder) {
                belowReorder++
              }
              return {
                name: (prodCount._id.split(':')[1] || ''),
                uom: (prodCount.base_uom.split(':')[1] || ''),
                count: prodCount.count,
                minLevel: min,
                reorderLevel: reorder,
                maxLevel: max
              }
            })
          }
          facilityStockReport.numBelow = belowReorder

          response.facilityStockCounts.push(facilityStockReport)
        }
      })
      res.json(response)
    })
  })

    // res.json(req.params)
}
