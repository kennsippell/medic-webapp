'use strict';

chrome.runtime.onInstalled.addListener(function() {
  console.log('On Installed');
  
  navigator.webkitTemporaryStorage.queryUsageAndQuota (
    function(usedBytes, grantedBytes) {
        console.log('Background is using ', usedBytes, ' of ', grantedBytes, 'bytes', usedBytes/grantedBytes*100, '%');
    },
  
    function(e) { console.log('Error', e);  }
  );
});



