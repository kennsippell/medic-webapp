angular.module('inboxServices').factory('SatelliteServer', function (ipCookie) {
  'use strict';
  'ngInject';

  let isAvailable = false;
  const serverUrl = ipCookie('satelliteServer');
  
  return {
    isEnabled: () => !!serverUrl, 
    tryGet: () => isAvailable && serverUrl,
    setAvailability: (available) => isAvailable = !!available,
  };
});
