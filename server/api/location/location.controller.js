'use strict';

var Location = require('./location.model.js');

// get list of locations
exports.index = function(req, res, next) {
  Location.all()
    .then(res.json.bind(res))
    .catch(next);
};
