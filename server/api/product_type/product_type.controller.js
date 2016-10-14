'use strict';

var ProductType = require('./product_type.model');
var productTypeSchema = require('./product_type.schema');
var Utility = require('../../components/utility');
var Promise = require('bluebird');
var Joi = Promise.promisifyAll(require('joi'));


// get list of product types
exports.list = function(req, res, next) {
  ProductType.all()
    .then(res.json.bind(res))
    .catch(next);
};

exports.create = function (req, res, next) {
  var payload = req.body;
  Joi.validateAsync(payload, productTypeSchema.createSchema)
    .then(ProductType.create)
    .then(getDocFromSaveResult)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
};

exports.save = function (req, res, next) {
  var payload = req.body;
  Joi.validateAsync(payload, productTypeSchema.updateSchema)
    .then(ProductType.save)
    .then(getDocFromSaveResult)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
};

exports.get = function (req, res, next) {
  var id = req.params.id;
  return ProductType.get(id)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
};

function getDocFromSaveResult (result) {
  return ProductType.get(result.id);
}

