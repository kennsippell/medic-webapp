angular.module('inboxServices').factory('SatelliteServer', function (ipCookie) {
  'use strict';
  'ngInject';

  let secondaryAvailable = false;
  const satelliteServer = ipCookie('satelliteServer');
  
  return {
    isEnabled: () => secondaryAvailable && !!satelliteServer, 
    tryGet: () => secondaryAvailable && satelliteServer,
    setAvailability: (available) => secondaryAvailable = !!available,
  };
});
