angular.module('inboxServices').factory('POUCHDB_OPTIONS', function (SatelliteServer) {
  'use strict';
  'ngInject';

  return () => ({
    local: { auto_compaction: true },
    remote: {
      skip_setup: true,
      fetch: (url, opts) => {
        opts.headers.set('Accept', 'application/json');
        opts.credentials = SatelliteServer.tryGet() ? 'include' : 'same-origin';
        return window.PouchDB.fetch(url, opts);
      },
    },
  });
});
