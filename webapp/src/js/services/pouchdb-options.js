angular.module('inboxServices').factory('POUCHDB_OPTIONS', function (ipCookie, SatelliteServer) {
  'use strict';
  'ngInject';

  // Can also consider an explicit overwrite of PouchDB.fetch
  return () => ({
    local: { auto_compaction: true },
    remote: {
      skip_setup: true,
      fetch: function(url, opts) {
        opts.headers.set('Accept', 'application/json');

        if (SatelliteServer.isEnabled()) {
          opts.headers.set('AuthSession', ipCookie('AuthSession'));
          opts.withCredentials = true;
        } else {
          opts.credentials = 'same-origin';
        }
        
        return window.PouchDB.fetch(url, opts);
      },
    },
  });
});
