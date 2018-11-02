var _ = require('underscore'),
    USER_DB_SUFFIX = 'user',
    META_DB_SUFFIX = 'meta';

// Regex to test for characters that are invalid in db names
// Only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed.
// https://wiki.apache.org/couchdb/HTTP_database_API#Naming_and_Addressing
var DB_NAME_BLACKLIST = /[^a-z0-9_$()+/-]/g;

angular.module('inboxServices').factory('DB',
  function(
    Location,
    pouchDB,
    POUCHDB_OPTIONS,
    Session,
    SatelliteServer
  ) {

    'use strict';
    'ngInject';

    var cache = {};
    var isOnlineOnly = Session.isOnlineOnly();

    var getUsername = function(remote) {
      var username = Session.userCtx().name;
      if (!remote) {
        return username;
      }
      // escape username in case they use invalid characters
      return username.replace(DB_NAME_BLACKLIST, function(match) {
        return '(' + match.charCodeAt(0) + ')';
      });
    };

    var getDbName = function(remote, meta, satelliteServerAddress) {
      const parts = [];
      if (remote) {
        const url = satelliteServerAddress ? `${satelliteServerAddress}/${Location.dbName}` : Location.url;
        parts.push(url);
      } else {
        parts.push(Location.dbName);
      }
      if (!remote || meta) {
        parts.push(USER_DB_SUFFIX);
        parts.push(getUsername(remote));
      }
      if (meta) {
        parts.push(META_DB_SUFFIX);
      }
      return parts.join('-');
    };

    var getParams = function(remote, meta) {
      var params = { };
      if (remote) {
        if (meta) {
          params.skip_setup = false;
        }
        _.defaults(params, POUCHDB_OPTIONS.remote);
      } else {
        _.defaults(params, POUCHDB_OPTIONS.local);
      }
      return params;
    };

    var get = function(options) {
      var userCtx = Session.userCtx();
      if (!userCtx) {
        return Session.navigateToLogin();
      }
      options = options || {};
      _.defaults(options, {
        remote: isOnlineOnly,
        meta: false
      });
      
      const satelliteServerAddress = SatelliteServer.tryGet();
      const name = getDbName(options.remote, options.meta, satelliteServerAddress);
      if (!cache[name]) {
        var db = pouchDB(name, getParams(options.remote, options.meta));
        cache[name] = db;
      }
      return cache[name];
    };

    if (!isOnlineOnly) {
      get({ local: true }).viewCleanup();
      get({ local: true, meta: true }).viewCleanup();
    }

    return get;
  }
);
