var Joi = require('joi');
var DOC_TYPES = require('../../components/db/db-constants').DOC_TYPES;

exports.createSchema = Joi.object().keys({
  name: Joi.string().min(1).max(35).required(),
  parent: Joi.string().default('').optional(),
  is_deleted: Joi.boolean().default(false)
});

exports.updateSchema = Joi.object().keys({
  name: Joi.string().min(1).max(35).required(),
  parent: Joi.string().default('').optional(),
  is_deleted: Joi.boolean().default(false),
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
  doc_type: Joi.string().default(DOC_TYPES.productCategory).valid(DOC_TYPES.productCategory),
  created: Joi.date().iso().required(),
  modified: Joi.date().iso().optional()
});
