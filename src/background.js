// background.js
'use strict';
if (typeof browser === "undefined") {
    var browser = chrome;
}



const permissionsToRequest = {
  permissions: ["storage"],
  origins: ["https://*.efaktura.mfin.gov.rs/*", "https://*.demoefaktura.mfin.gov.rs/*"],
};



chrome.runtime.onInstalled.addListener(async () => {
	function onResponse(response) {
    if (response) {
      console.log("Permission was granted");
    } else {
      console.log("Permission was refused");
    }
    return browser.permissions.getAll();
  }

  const response = await browser.permissions.request(permissionsToRequest);
  const currentPermissions = await onResponse(response);

  console.log(`Current permissions:`, currentPermissions);
});

//document.addEventListener('DOMContentLoaded', requestPermissions);
