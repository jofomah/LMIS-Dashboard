'use strict';

var dbService = require('../../components/db');
var VIEWS = require('../../components/db/db-constants').VIEWS;

var doc_type = 'location'


exports.all = function (options) {
  var opts = options || {include_docs: true, key: doc_type}
  return dbService.queryBy(VIEWS.byDocTypes, opts)
};
