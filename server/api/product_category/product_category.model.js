'use strict';

var dbService = require('../../components/db');
var VIEWS = require('../../components/db/db-constants').VIEWS;
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;

// expose public functions
exports.all = all;
exports.create = create;
exports.get = get;
exports.save = save;

function all() {
  var options = {
    key: DOC_TYPES.productCategory,
    include_docs: true
  };
  return dbService.queryBy(VIEWS.byDocTypes, options);
}

function create (doc) {
  doc.doc_type = DOC_TYPES.productType;
  doc._id = dbService.getIdFrom(DOC_TYPES.productCategory, doc.name);
  return dbService.create(doc);
}

function save (doc) {
  doc.doc_type = DOC_TYPES.productCategory;
  return dbService.save(doc);
}

function get (id) {
  return dbService.get(id);
}
