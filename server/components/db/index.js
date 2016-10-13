'use strict';

var Promise = require('bluebird');

var cradle = require('cradle');
var config = require('../../config/environment');

var db = new (cradle.Connection)().database(config.couch.db);

// Promisified Cradle callback interface: Async is appended to each function. e.g cradle.view become cradle.viewAsync
// see: http://bluebirdjs.com/docs/working-with-callbacks.html#working-with-callback-apis-using-the-node-convention
db = Promise.promisifyAll(db);


function toArray(cradleResultSet) {
  return cradleResultSet.toArray();
}

exports.queryBy = function (view, options) {
  var opts = options || {}
  return db.viewAsync(view, opts)
    .then(toArray);
};
