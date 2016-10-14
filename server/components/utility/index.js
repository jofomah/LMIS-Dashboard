'use strict';

var _ = require('lodash');

exports.isNotDesignDoc = function isNotDesignDoc(doc) {
  return doc && doc._id && doc._id.substr(0, 7) !== '_design';
};

exports.removeDesignDocs = function removeDesignDocs(docs) {
  if (!docs || !docs.length)
    return docs;

  return docs.filter(exports.isNotDesignDoc);
};

exports.parseBool = function parseBool(value) {
  return (value === true || value === 'true' || value === '1' || value === 1);
};

exports.handleError = function (err, res) {
  var statusCode = (err.headers && err.headers.status);
  var errMsg = _.omit(err, 'headers');
  if (statusCode && errMsg) {
    res.status(statusCode).json(errMsg);
    return;
  }
  throw err;
};
