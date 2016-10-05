'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('uom');
var config = require('../../config/environment');
var lomisDB = new (cradle.Connection)().database(config.couch.db);



exports.all = all;

function all(cb) {
  db.all({ include_docs: true }, function(err, rows) {
    if (err) return cb(err);

    return cb(null, utility.removeDesignDocs(rows.toArray()));
  });
}

function list(cb) {

}
