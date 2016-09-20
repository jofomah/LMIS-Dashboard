'use strict';

var express = require('express');
var controller = require('./stock_count.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/unopened', auth.isAuthenticated(), controller.unopened);
router.get('/in_range', auth.isAuthenticated(), controller.inDateRange);
router.get('/by/:locationId/:programId/:startDate/:endDate', auth.isAuthenticated(), controller.by);

module.exports = router;
