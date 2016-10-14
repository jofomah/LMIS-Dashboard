'use strict';

var Promise = require('bluebird');

var cradle = require('cradle');
var config = require('../../config/environment');

var db = new (cradle.Connection)().database(config.couch.db);

// Promisified Cradle callback interface: Async is appended to each function. e.g cradle.view become cradle.viewAsync
// see: http://bluebirdjs.com/docs/working-with-callbacks.html#working-with-callback-apis-using-the-node-convention
db = Promise.promisifyAll(db);

exports.addTimeInfo = addTimeInfo;

exports.queryBy = function (view, options) {
  var opts = options || {}
  return db.viewAsync(view, opts)
    .then(toArray);
};

exports.save = function (doc) {
  doc = addTimeInfo(doc);
  if (doc._rev) {
    return db.saveAsync(doc._id, doc._rev, doc);
  }
  return db.saveAsync(doc._id, doc);
};

exports.get = function (id) {
  return db.getAsync(id);
};

function toArray(cradleResultSet) {
  return cradleResultSet.toArray();
}

function addTimeInfo (doc) {
  var now = new Date().toJSON();
  if (!doc.created) {
    doc.created = now;
  }
  doc.modified = now;
  return doc;
}
