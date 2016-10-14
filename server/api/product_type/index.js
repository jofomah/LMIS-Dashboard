'use strict';

var express = require('express');
var controller = require('./product_type.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.save);

module.exports = router;
