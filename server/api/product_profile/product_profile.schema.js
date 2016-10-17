'use strict';

var Joi = require('joi');
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;

exports.createSchema = Joi.object().keys({
  name: Joi.string().min(1).max(35).required(),
  productCategory: Joi.string().required(),
  productType: Joi.string().required(),
  productPresentation: Joi.string().required(),
  is_deleted: Joi.boolean().default(false)
});

exports.updateSchema = Joi.object().keys({
  name: Joi.string().min(1).max(35).required(),
  productCategory: Joi.string().required(),
  productType: Joi.string().required(),
  productPresentation: Joi.string().required(),
  is_deleted: Joi.boolean().default(false),
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
  doc_type: Joi.string().default(DOC_TYPES.productProfile).valid(DOC_TYPES.productProfile),
  created: Joi.date().iso().required(),
  modified: Joi.date().iso().default(null).optional()
});
