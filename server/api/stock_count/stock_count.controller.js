'use strict';

var StockCount = require('./stock_count.model');
var Facility = require('../facility/facility.model');
var FacilityProgramProducts = require('../facility_program_products/facility_program_products.model');
var dbService = require('../../components/db');
var VIEWS = require('../../components/db/db-constants').VIEWS;
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var Promise = require("bluebird");


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
  // get all facilities within a given location,
  var facilityByLocQuery = {
    key: req.params.locationId,
    include_docs: true
  };
  //TODO: Check if user is allowed to see for this location, else return access restriction error message
  Facility.byLocation(facilityByLocQuery)
    .then(function (facilities) {
      var startDateInMilliSec = new Date(req.params.startDate).getTime()
      var endDateInMilliSec = new Date(req.params.endDate).getTime()
      var startKey = [req.params.programId, startDateInMilliSec]
      var endKey = [req.params.programId, endDateInMilliSec, '\ufff0']
      var queryKeysPair = buildQueryKeys (facilities, req.params.programId)
      var stockCountQueryOptions = {
        startkey: startKey,
        endkey: endKey,
        include_docs: true
      }
      var fppQueryOptions = {
        keys: queryKeysPair.facilityProgramProducts,
        include_docs: true
      }
      var coreDocsQueryOptions = {
        include_docs: true,
        keys: [DOC_TYPES.productType]
      };
      var facAdminQueryOptions = {
        include_docs: true,
        keys: queryKeysPair.facilityIds
      };
      // this query returns Stock Counts and Facility Program Products along with their linked documents
      return Promise
        .props({
          facilityAncestorAdminBoundaries: Facility.byId(facAdminQueryOptions),
          coreDocs: dbService.queryBy(VIEWS.byDocTypes, coreDocsQueryOptions),
          stockCounts: StockCount.getBy(stockCountQueryOptions),
          facilityProgramProductProfiles: FacilityProgramProducts.getBy(fppQueryOptions)
        })
        .then(function (rsByKey) {
          var resultSet = buildResultSet(rsByKey)
          return StockCount.buildList(resultSet, facilities, req.params)
        })
        .then(res.json.bind(res))
    })
    .catch(next)
}

// private functions
function buildResultSet (rsByKey) {
  return rsByKey.stockCounts.concat(
    rsByKey.stockCounts,
    rsByKey.facilityProgramProductProfiles,
    rsByKey.coreDocs,
    rsByKey.facilityAncestorAdminBoundaries
  );
}

function buildQueryKeys (facilities, programId) {
  var fppKeys = []
  var facilityIds = []
  facilities.forEach(function (facility) {
    fppKeys.push([facility._id, programId]);
    facilityIds.push(facility._id)
  });
  return {
    facilityProgramProducts: fppKeys,
    facilityIds: facilityIds
  }
}
