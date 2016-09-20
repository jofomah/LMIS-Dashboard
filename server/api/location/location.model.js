'use strict';

var cradle = require('cradle');
var utility = require('../../components/utility');
var config = require('../../config/environment');

var db = new (cradle.Connection)().database(config.couch.db);
var doc_type = 'location'

exports.all = all;



function all(cb) {
  var options = {
    include_docs: true,
    key: doc_type
  }
  db.view('doctypes/by-type', options, function (err, res) {
    if (err) return cb(err);
    return cb(null, res.toArray());
  });
}
