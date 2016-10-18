var dbService = require('../../components/db');
var VIEWS = require('../../components/db/db-constants').VIEWS;

exports.getBy = getBy;

function getBy(options) {
  var opts = options || {};
  return dbService.queryBy(VIEWS.facilityProgramProducts, opts);
}
