"use strict";
if (typeof browser === "undefined") {
    var browser = chrome;
}

/* ********************************************************* */
/* *********************** PERMISIJE *********************** */
/* ********************************************************* */
const permissions = {
  origins: ["https://*.efaktura.mfin.gov.rs/*", "https://*.demoefaktura.mfin.gov.rs/*"],
};

const checkbox_host_permission = document.getElementById("checkbox_host_permission");

checkbox_host_permission.onchange = async () => {
  if (checkbox_host_permission.checked) {
    let granted = await browser.permissions.request(permissions);
    if (!granted) {
		checkbox_host_permission.checked = false;
    }
  } else {
    try {
      await browser.permissions.remove(permissions);
    } catch (e) {
      console.error(e);
      checkbox_host_permission.checked = true;
    }
  }
};
browser.permissions.contains(permissions).then(granted => {
	checkbox_host_permission.checked = granted;
	if(granted){
		document.getElementById("host_permission").style.display = "none";
	}
});


function reloadTabs(){
	browser.tabs.query({ url: 'https://*.efaktura.mfin.gov.rs/*' }, function(tabs) {
		tabs.forEach(function(tab) {
			browser.tabs.reload(tab.id);
		});
	});
}

function save_options() {

	var bulk_odobri = document.getElementById('opt_bulk_odobri').checked;
	var night_mode = document.getElementById('opt_night_mode').checked;
	var night_mode_auto = document.getElementById('opt_night_mode_auto').checked;
	var reminder = document.getElementById('opt_reminder').checked;
	var test_mod = document.getElementById('opt_test_mod').checked;

	browser.storage.sync.set({ 
		bulk_odobri: bulk_odobri,
		night_mode: night_mode,
		night_mode_auto: night_mode_auto,
		reminder: reminder,
		test_mod: test_mod,
	}).then(setItems, onError);

	function setItems() {
		
		var status = document.getElementById('status');
		// status.innerHTML = 'Opcije su sačuvane <span id="opcijeReloadSite"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABC0lEQVR4nJ3TO04DUQwF0AQBC4CGil9oQ9bABsIGWELEp0KCsJfsIi0oW4CeTyQ6PhV0B1l40GSYiSCWLD09+15f2++1WjWGNnrop+/HXTWnDriKM0x920d62D2OsYxzjKrgdUzwggtsl2K7GOI9c0YYVytPcIvNhrai8gGeU9EMwWlWrgVnzpFZG5cHNg3ZTeDMW4q2sp3wjSLQS8adeQTzmA9j0gvgrrBXEHzW7rUZ3M719hdqAZ3EdAu2J1z+U/7Dj2qc4BVbfwDHJt4wKF+u4CYfUiNJgu9wHZhqMJ5ykISSeLadSs8hOyoHeK2pQiiJD/NY+kyxobDoefCrcgNRDLZb+s5xrl3zFxmenz2CEuYiAAAAAElFTkSuQmCC" style="vertical-align: bottom;"> Osveži sve tabove</span>';
		status.innerHTML = "Opcije su sačuvane. Osveži sajt eFakture.";
		status.style.opacity = "1";
		
	}

	function onError(error) {
	  console.log(error);
	}

}

function restore_options() {

	browser.storage.sync.get({
		bulk_odobri: true,
		night_mode: false,
		night_mode_auto: false,
		reminder: true,
		test_mod: false
		},(items) => {

			document.getElementById('opt_bulk_odobri').checked = items.bulk_odobri;
			document.getElementById('opt_night_mode').checked = items.night_mode;
			document.getElementById('opt_night_mode_auto').checked = items.night_mode_auto;
			document.getElementById('opt_reminder').checked = items.reminder;
			document.getElementById('opt_test_mod').checked = items.test_mod;
			
			if (document.getElementById('opt_night_mode').checked == true){
				document.getElementById("nightAuto").style.display = "block";
			} else {
				document.getElementById("nightAuto").style.display = "none";
			}
	});

}

document.addEventListener('DOMContentLoaded', restore_options);


/* ****************************************************************************** */
/* *********************** HOOK NA CHANGE EVENT ZA OPCIJE *********************** */
/* ****************************************************************************** */
document.getElementById('opt_night_mode').addEventListener('change', (event) => {
	if (event.target.checked) {
		document.getElementById("nightAuto").style.display = "block";
	} else {
		document.getElementById("nightAuto").style.display = "none";
	}
	save_options();
});
document.getElementById('opt_bulk_odobri').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_reminder').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_test_mod').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_night_mode_auto').addEventListener('change', (event) => {
	save_options();
});

checkbox_host_permission.addEventListener('change', function() {
	if(checkbox_host_permission.checked){
		window.close();
	}
});



/* ****************************************************************************** */
/* ************************ RELOAD SVE TABOVE NA KLIK ************************ */
/* ****************************************************************************** */
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'opcijeReloadSite') {
      reloadTabs();
	  document.getElementById('status').innerHTML = "";
    }
  });
});