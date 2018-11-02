angular.module('inboxServices').factory('SatelliteServer', function (ipCookie) {
  'use strict';
  'ngInject';

  let secondaryAvailable = false;
  const satelliteServer = ipCookie('satelliteServer');
  
  return {
    tryGet: () => secondaryAvailable && satelliteServer,
    setAvailability: (available) => secondaryAvailable = !!available,
  };
});
