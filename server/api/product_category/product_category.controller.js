'use strict';

var ProductCategory = require('./product_category.model');
var config = require('../../config/environment');
var productCategorySchema = require('./product_category.schema');
var Utility = require('../../components/utility');
var Promise = require('bluebird');
var Joi = Promise.promisifyAll(require('joi'));


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
      Utility.handleError(err, res);
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
      Utility.handleError(err, res);
    })
    .catch(next);
};

exports.get = function (req, res, next) {
  var id = req.params.id;
  return ProductCategory.get(id)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
}

function getDocFromSaveResult (result) {
  return ProductCategory.get(result.id);
}
