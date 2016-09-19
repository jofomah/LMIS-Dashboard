'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('stockcount');

var config = require('../../config/environment');
var lomisDB = new (cradle.Connection)().database(config.couch.db);

exports.all = all;
exports.unopened = unopened;
exports.getWithin = getWithin;
exports.getBy = getBy;


function all(cb) {
  db.all({ include_docs: true }, function(err, rows) {
    if (err) return cb(err);

    return cb(null, utility.removeDesignDocs(rows.toArray()));
  });
}

function unopened(cb) {
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

/**
 *
 * @param options - {object} to be used to override query options if define, pass null to use default value
 * @param cb {Function} - callback with two arguments (err, result)
 */
function getBy (options, cb) {
  var opts = options || {}
  lomisDB.view('stockcount/by_program_countdate_facility', opts, function (err, rows) {
    if (err)  {
      cb(err)
    }
    return cb(null, rows.toArray())
  })
}
