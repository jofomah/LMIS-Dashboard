'use strict';

var Joi = require('joi');
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;

exports.createSchema = Joi.object().keys({
  name: Joi.string().min(1).max(35).required(),
  code: Joi.string().min(1).max(10).required(),
  active: Joi.boolean().default(true).required(),
  base_uom: Joi.string().required(),
  description: Joi.string().default(null).optional(),
  is_deleted: Joi.boolean().default(false).optional()
});

exports.updateSchema = Joi.object().keys({
  name: Joi.string().min(1).max(35).required(),
  code: Joi.string().min(1).max(10).required(),
  active: Joi.boolean().default(true).required(),
  base_uom: Joi.string().required(),
  description: Joi.string().default(null).optional(),
  is_deleted: Joi.boolean().default(false).optional(),
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
  doc_type: Joi.string().default(DOC_TYPES.productType).valid(DOC_TYPES.productType),
  created: Joi.date().iso().required(),
  modified: Joi.date().iso().optional()
});
