'use strict';

var cradle = require('cradle');
var _ = require('lodash')
var utility = require('../../components/utility');

exports.all = all;
exports.unopened = unopened;
exports.getWithin = getWithin;

function all(cb) {
  // TODO: deprecate or update to work with new db service
  db.all({ include_docs: true }, function(err, rows) {
    if (err) return cb(err);

    return cb(null, utility.removeDesignDocs(rows.toArray()));
  });
}

function unopened(cb) {
  // TODO: deprecate or update to work with new db service
  var opts = {
    reduce: true,
    group: true,
    group_level: 3
  };

  db.view('stockcount/unopened', opts, function(err, res) {
    if (err) return cb(err);

    var items = {};
    res.forEach(function(key, value, id) {
      var k = key[0] + key[1];
      items[k] = items[k] || {
        facility: key[0],
        date: new Date(key[1]),
        products: {}
      };

      items[k].products[key[2]] = { count: value };
    });

    var rows = Object.keys(items)
      .map(function(key) {
        return items[key];
      })
      .sort(function(a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
      });

    return cb(null, rows);
  });
}

function getWithin(startDate, endDate, cb) {
  // TODO: deprecate or update to work with new db service
  var opts = {
    startkey: startDate,
    endkey: endDate
  };
  db.view('stockcount/by_date', opts, function(err, rows){
    if(err){
      return cb(err);
    }
    return cb(null, rows.toArray());
  });
}

// TODO: new method from refactoring 20-09-2016, deprecate functions above
var dbService = require('../../components/db');
var VIEWS = require('../../components/db/db-constants').VIEWS;
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;
var _ = require('lodash');


var stockCountDocType = 'stock-count'
// expose public functions
exports.buildList = buildList;
exports.getBy = getBy;
//expose for testing purpose
exports.sortByDate = sortByDateDesc;
exports.buildProductCount = buildProductCount;
exports.pickFacilityMostRecentStockCount = pickFacilityMostRecentStockCount;


function getBy (options) {
  var opts = options || {};
  return dbService.queryBy(VIEWS.stockCountByProgramCountDateAndFacility, opts);
}

function buildProductCount (productCounts, resultSetById) {
  return productCounts.map(function (pc) {
    var pp = resultSetById[pc._id] || {};
    var pt = resultSetById[pp.productType] || {};
    var baseUOM = resultSetById[pc.base_uom] || {};
    pc.productType = {
      _id: pt._id,
      code: pt.code || ''
    };
    pc.name = pp.name || '';
    pc.uom = {
      _id: baseUOM._id,
      name: baseUOM.name
    };
    return pc;
  });
}

function buildFacilityAdmin (ancestors, resultSetById) {
  return ancestors.map(function (ancestor) {
    var temp = resultSetById[ancestor._id];
    ancestor.name = (temp && temp.name) || '**UNKNOWN';
    return ancestor;
  });
}

function  buildProgramProducts (facilityProgramProducts, resultSetById) {
  return facilityProgramProducts.map(function (ffp) {
    var pt = resultSetById[ffp.productTypeId] || {};
    return {
      productType: {
        _id: pt._id,
        code: pt.code
      },
      minLevel: ffp.minLevel || '',
      reorderLevel: ffp.reorderLevel || '',
      maxLevel: ffp.maxLevel || ''
    }
  });
}

function buildStockCount (stockCount, resultSetById, facilitiesById, facilityProgramProducts) {
  var facility = facilitiesById[stockCount.facilityId] || {};
  var productCounts = stockCount.productCounts || [];
  return {
    _id: stockCount._id,
    facility: {
      name: facility.name,
      _id: facility._id,
      ancestors: buildFacilityAdmin ((facility && facility.location && facility.location.ancestors) || [], resultSetById)
    },
    countDate: stockCount.countDate,
    programProducts: buildProgramProducts (facilityProgramProducts, resultSetById),
    productCounts: buildProductCount(productCounts, resultSetById, facilityProgramProducts)
  }
}

function buildStockCountList (facilitiesById, programProductsByFacilityId, resultSetIndexById) {
  var item;
  var stockCounts = [];
  for (var id in resultSetIndexById) {
    item = resultSetIndexById[id]
    if (item && item.doc_type === stockCountDocType && item.facilityId) {
      var facilityProgramProducts = programProductsByFacilityId[item.facilityId] || [];
      stockCounts.push(buildStockCount(item, resultSetIndexById, facilitiesById, facilityProgramProducts))
    }
  }
  return stockCounts
}

function pickFacilityMostRecentStockCount(stockCounts) {
  var trackAlreadyPickedFacilityCounts = [];
  var uniqueMostRecentFacilityStockCounts = [];
  // sorting by countDate and created date if equal is important so that we pick only the most recent one.
  // i.e if a facility has two stock counts with same count date, the one with most recent created date is picked (wins)
  sortByDateDesc(stockCounts).forEach(function (stockCount) {
    if (stockCount.facility && trackAlreadyPickedFacilityCounts.indexOf(stockCount.facility._id) === -1) {
      uniqueMostRecentFacilityStockCounts.push(stockCount);
      trackAlreadyPickedFacilityCounts.push(stockCount.facility._id);
    }
  });
  return uniqueMostRecentFacilityStockCounts;
}

function buildList (resultSet, facilities, requestParams) {
  // remove possible duplicates since result set is built by concatenating multiple result sets
  // NOTE: This assumes that all the result set was called with "include_docs" flag.
  resultSet = _.unique(resultSet)
  var resultSetIndexById = _.indexBy(resultSet, function (row) { return (row && row._id) || ''; })
  var facilitiesById = _.indexBy(facilities, '_id');
  var resultSetGroupedByType = _.groupBy(resultSet, function (row) { return row.doc_type; });
  var programProductsByFacilityId = _.groupBy(resultSetGroupedByType[DOC_TYPES.facilityProgramProductProfile], function (row) { return (row && row.facilityId) || '' });
  var stockCounts = buildStockCountList (facilitiesById, programProductsByFacilityId, resultSetIndexById)
  return {
    adminLocationId: requestParams.locationId,
    from: requestParams.startDate,
    to: requestParams.endDate,
    programId: requestParams.programId,
    facilityStockCounts: pickFacilityMostRecentStockCount(stockCounts)
  };
}

function sortByDateDesc (stockCounts) {
  return stockCounts.sort(function (a, b) {
    var result = (new Date(b.countDate).getTime() - new Date(a.countDate).getTime());
    var isEqual = result === 0;
    return isEqual? (new Date(b.created).getTime() - new Date(a.created).getTime()) : result;
  });
}
