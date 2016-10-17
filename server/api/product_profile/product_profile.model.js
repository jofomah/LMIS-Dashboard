'use strict';

var dbService = require('../../components/db');
var VIEWS = require('../../components/db/db-constants').VIEWS;
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;


// expose public functions
exports.all = all;
exports.get = get;
exports.create = create;
exports.save = save;

function all() {
  var options = {
    key: DOC_TYPES.productProfile,
    include_docs: true
  };
  return dbService.queryBy(VIEWS.byDocTypes, options);
}

function get (id) {
  return dbService.get(id);
}

function create (doc) {
  doc.doc_type = DOC_TYPES.productProfile;
  doc._id = dbService.getIdFrom(DOC_TYPES.productProfile, doc.name);
  return dbService.create(doc);
}

function save (doc) {
  doc.doc_type = DOC_TYPES.productProfile;
  return dbService.save(doc);
}
