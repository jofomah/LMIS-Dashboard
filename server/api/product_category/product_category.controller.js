'use strict';

var ProductCategory = require('./product_category.model');
var config = require('../../config/environment');
var productCategorySchema = require('./product_category.schema');
var Promise = require('bluebird');
var Joi = Promise.promisifyAll(require('joi'));
var _ = require('lodash');

// get list of product categories
exports.all = function(req, res, next) {
  ProductCategory.all()
    .then(res.json.bind(res))
    .catch(next);
};

exports.create = function (req, res, next) {
  var payload = req.body;
  Joi.validateAsync(payload, productCategorySchema.createSchema)
    .then(ProductCategory.create)
    .then(getDocFromSaveResult)
    .then(res.json.bind(res))
    .catch(function (err) {
      handleError(err, res);
    })
    .catch(next);
};

exports.save = function (req, res, next) {
  var payload = req.body;
  Joi.validateAsync(payload, productCategorySchema.updateSchema)
    .then(ProductCategory.save)
    .then(getDocFromSaveResult)
    .then(res.json.bind(res))
    .catch(function (err) {
      handleError(err, res);
    })
    .catch(next);
};

function getDocFromSaveResult (result) {
  return ProductCategory.get(result.id);
}

function handleError(err, res) {
  var statusCode = (err.headers && err.headers.status);
  var errMsg = _.omit(err, 'headers');
  if (statusCode && errMsg) {
    res.status(statusCode).json(errMsg);
    return;
  }
  throw err;
}
