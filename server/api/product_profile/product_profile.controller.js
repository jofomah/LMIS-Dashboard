'use strict';

var ProductProfile = require('./product_profile.model');
var Utility = require('../../components/utility');
var productProfileSchema = require('./product_profile.schema');
var Promise = require('bluebird');
var Joi = Promise.promisifyAll(require('joi'));

// get list of product profiles
exports.index = function(req, res, next) {
  ProductProfile.all()
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next)
};

exports.get = function (req, res, next) {
  var id = req.params.id;
  return ProductProfile.get(id)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
};

exports.create = function (req, res, next) {
  var payload = req.body;
  Joi.validateAsync(payload, productProfileSchema.createSchema)
    .then(ProductProfile.create)
    .then(getDocFromSaveResult)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
}

exports.save = function (req, res, next) {
  var payload = req.body;
  Joi.validateAsync(payload, productProfileSchema.updateSchema)
    .then(ProductProfile.save)
    .then(getDocFromSaveResult)
    .then(res.json.bind(res))
    .catch(function (err) {
      Utility.handleError(err, res);
    })
    .catch(next);
};

function getDocFromSaveResult (result) {
  return ProductProfile.get(result.id);
}
