'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'lmis-dashboard-secret'
  },

  // CouchDB connection options
  couch: {
    host: '',
    port: 5984,
    auth: {
      username: process.env.COUCH_USER,
      password: process.env.COUCH_PASS
    },
    forceSave: false
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
var configFile = process.env.NODE_CONFIG || process.env.NODE_ENV;
module.exports = _.merge(
  all,
  require('./' + configFile + '.js') || {});