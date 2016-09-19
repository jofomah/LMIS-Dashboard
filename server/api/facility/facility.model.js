'use strict';

var q = require('q');
var cradle = require('cradle');
var utility = require('../../components/utility');
var config = require('../../config/environment');
var db = new (cradle.Connection)().database('facilities');

// new unified single LoMIS DB
var lomisDB = new (cradle.Connection)().database(config.couch.db);

// use promises for caching across all requests
var allPromise = null;

db.exists(function(err, exists) {
  if (err) throw err;

  if (!exists)
    db.create(addChangeHandler);
  else
    addChangeHandler();

  function addChangeHandler() {
    // clear cache on db changes
    db.changes().on('change', function() {
      db.cache.purge();
      allPromise = null;
    });
  }
});

// exports
exports.all = all;
exports.byLocation = byLocation;


function byLocation (options, cb) {
  var queryOptions = options || {}
  lomisDB.view('facility/by_location', queryOptions, function (err, res) {
    if (err) return cb(err);
    return cb(null, res.toArray());
  });
}


function all(cb) {
  if (!allPromise) {
    var d = q.defer();
    allPromise = d.promise;

    db.all({ include_docs: true }, function(err, rows) {
      if (err)
        d.reject(err);
      else
        d.resolve(rows);
    });
  }

  allPromise
    .then(function(rows) {
      cb(null, utility.removeDesignDocs(rows.toArray()));
    })
    .catch(function(err) {
      allPromise = null;
      cb(err);
    })
}
