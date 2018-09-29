'use strict';

navigator.webkitTemporaryStorage.queryUsageAndQuota (
  function(usedBytes, grantedBytes) {
      console.log('Content-Script is using ', usedBytes, ' of ', grantedBytes, 'bytes', usedBytes/grantedBytes*100, '%');
  },

  function(e) { console.log('Error', e);  }
);
