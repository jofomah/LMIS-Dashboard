'use strict';

var Location = require('./location.model.js');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

// get list of states
exports.index = function(req, res, next) {
  Location.all(function(err, locations) {
    if (err) return next(err);

    res.json(locations);
  });
};
