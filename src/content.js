/* ---------------------------------------------
Autor: Stefan Marjanov - stefanmarjanov.com

Ovaj dodatak se nudi kao "takav kakav jeste", i možda neće raditi u vašem slučaju.

Ovaj program je besplatan softver: možete ga redistribuirati i/ili modifikovati
pod uslovima Apache 2.0 licence.

Ovaj program se distribuira s nadom da će biti koristan, ali BEZ IKAKVIH GARANCIJA;
čak i bez podrazumevane garancije PRODAVNOSTI ili PRILAGOĐENOSTI ZA ODREĐENU SVRHU.
Pogledajte Apache 2.0 licencu za više detalja: https://www.apache.org/licenses/LICENSE-2.0

Dodatak koristite na sopstvenu odgovornost. Ovo je nezvaničan dodatak.
--------------------------------------------- */

if (typeof browser === "undefined") {
    var browser = chrome;
}

// Preuzmi user opcije i prosledi u init
browser.storage.sync.get({
	night_mode: false,
	night_mode_auto: false,
	bulk_odobri: true,
	reminder: true,
	test_mod: false
	},(items) => {
	init([items.night_mode, items.night_mode_auto, items.bulk_odobri, items.reminder, items.test_mod]);
});

function applyColors(tip = "dark"){

	if(tip == "dark"){

		document.documentElement.classList.add('nocni_mod');
		$(":root").css({
			"--bg-paper": "#1e1e1e",
			"--header-background-color-logged-in": "#070707",
			"--header-background-color": "#070707",
			"--bg-default": "#070707",
			"--text-secondary": "#2d95d8",
			"--text-hint": "#8d8d8d",
			"--gray-92": "#393b3d",
			"--text-primary": "#dcdcdc",
			"--color-bg-pdf": "#131313",
			"--header-color": "#fff",
			"--gray-98": "#2c2c2c",
			
		});
	
		
	} else {
		document.documentElement.classList.remove('nocni_mod');
		$(":root").css({
			"--bg-paper": "",
			"--header-background-color-logged-in": "",
			"--header-background-color": "",
			"--bg-default": "",
			"--text-secondary": "",
			"--text-hint": "",
			"--gray-92": "",
			"--text-primary": "",
			"--color-bg-pdf": "",
			"--header-color": "",
			"--gray-98": "",
		});
		
		
	}
}

function checkColorMode(isNightMode, isNightAuto, isSystemDark ){
	if( isNightMode ){ 
		
		if(isNightAuto){ // Ako korisnik želi da uskladi dark mode sa sistemom
			if(isSystemDark) { // Ako je dark mode u sistemu zapravo uključen
				applyColors("dark");
			}
		} else {
			applyColors("dark");
		}
		
	}
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function notif(rezultat, isTestMod, errMsg = false){
	
	if($("#popup").length) { $("#popup").remove(); }
	
	var testMsg = "Poslednje izmene";
	if(isTestMod){
		testMsg = "Rezultati testa";
	}
	
	var popupBody = '<table id="resultTable"><thead><tr><th>Faktura</th><th>Prethodni status</th><th>Novi status</th></tr></thead><tbody></tbody></table>';
	
	if( errMsg && errMsg != "" ){
		popupBody = '<p style="margin: 10px;">Greška: '+errMsg+'</p>';
	}
	
	var popup = $('<div id="popup"><span id="minimize-btn">'+testMsg+'</span>'+popupBody+'</div>');
    $("body").append(popup);
	
	if(rezultat && !errMsg){
		let tableBody = document.querySelector('#resultTable tbody');
		var prevedi = {
			"seen":"Pregledano", 
			"approved":"Odobreno",
			"new":"Nova",
			"reminded":"Podsetnik poslat",
			"renotified":"Ponovo obavešteni",
			"storno":"Stornirano",
			"rejected":"Odbijeno"
		};
		
		rezultat.forEach(single => {
			let row = document.createElement('tr');
			let fakturaCell = document.createElement('td');
			let oldstatusCell = document.createElement('td');
			let newstatusCell = document.createElement('td');
			
			let brFakture = single.faktura;
			let oldStatus = single.old_status;
			let newStatus = single.new_status;
			
			fakturaCell.textContent = brFakture;
			oldstatusCell.textContent = prevedi[oldStatus.toLowerCase()];
			newstatusCell.textContent = prevedi[newStatus.toLowerCase()];

			row.appendChild(fakturaCell);
			row.appendChild(oldstatusCell);
			row.appendChild(newstatusCell);

			tableBody.appendChild(row);
		});
	}
	

    popup.show();
	
	var popupHeight = popup.outerHeight();
	
	// Automatski spusti popup posle X sekundi
	const popupTimeout = setTimeout(function() {
        popup.addClass("minimized");
		popup.animate({bottom: -popupHeight}, 500);
    }, 3000);
	
	// Spusti/prikaži na klik
	popup.on("click", "#minimize-btn", function() {
		clearTimeout(popupTimeout);
			popup.toggleClass("minimized");
		if (popup.hasClass("minimized")) {
			popup.animate({bottom: -popupHeight}, 500);
		} else {
			popup.animate({bottom: "20px"}, 500);
		}
	});

}

function callapi(isReminder, isTestMod){
	
	var selected = $('.purchaseInvoices #ssp_decoratedDataTable .table-body .rt-tr.-selected');
	if(selected.length < 1) {
		alert("Nijedan red nije selektovan");
		return;
	}
	
	if(isReminder) {
		if (confirm("Da li ste sigurni da želite da nastavite? Sve izabrane 'Nove' i 'Pregledane' fakture će biti ODOBRENE. (Ovu poruku možete isključiti u podešavanjima dodatka)") != true) {
		  return;
		}
	}
	 
	var rezultat = [];
	
	var _this = $(this);
	_this.prop("disabled",true);
	$(".ReactTable .-loading").css({"z-index":"1","opacity":"1"});
	
	// Učitaj izabrani ID kompanije
	var companyId = localStorage.getItem("userSelectedCompany");

	if(!companyId) {
		alert("Company ID nije pronađen. Odjavite se i prijavite pa pokušajte ponovo.");
		_this.prop("disabled",false);
		return;
	}
	
	var promises = [];
	
	// Prođi kroz sve selektovane redove
	selected.each(function(i, obj) {

		// Proveri da li je kolona "Status" omogućena pa ako jeste uzmi vrednost
		var status = false;
		if( $('div[class*="statusContainer"]').length ) {
			var status = $(obj).find(".src-components-StatusIndicator-__styles-module___statusContainer span[class*='src-components-StatusIndicator-__styles-module___indicator-']").attr("class").split("-").pop(); // Pronađi trenutni status fakture
		}
		
		var invoiceId = $(obj).find('div[name="checkBoxItem"]').attr("id").split('checkbox-')[1]; // Pronađi ID fakture
		
		if( !invoiceId || invoiceId == "" ) { return; }
		
		// Ako znamo status (kolona Status je omogućena) i Status nije Nova/Pregledano, preskoči fakturu
		// Ovo je front-end provera, kasnije se radi i serverska provera
		if(status && status !== "new" && status !== "seen") { 
			
			if( $(obj).find('div[name="ssp_columndefs_Purchases_invoicenumber"]').length ){
				invoiceId = $(obj).find('div[name="ssp_columndefs_Purchases_invoicenumber"] > div:not(".src-scenes-App-pages-PurchaseInvoices-__styles-module___pdfIcon")').text();
			} 
			
			rezultat.push( {"faktura": invoiceId, "old_status": status, "new_status": status} );
			console.log("Front-end: Račun broj "+invoiceId+" nije ažuriran jer nije moguće menjati trenutni status fakture ("+status+")");

			return; // Preskoči ovaj red
		} 
		
		var promise = $.ajax({
			url: "/api/purchase-invoice/"+invoiceId,
			type: "GET",
			contentType: 'application/json',
			headers: {
				"Companyid": companyId
			}
		});
		
		promises.push(promise);
		
		promise.done(function(response, textStatus, xhr) {
			
			if( textStatus == "nocontent" || xhr.status != 200 || !response ) {
				return;
			}
							
			var checkStatus = response.Status;
			var checkInvoiceId = response.InvoiceId;
			var checkInvoiceNumber = response.InvoiceNumber;
			
			// Proveri status fakture na serveru kako bismo izbegli timing koliziju
			if ( checkStatus === 'New' || checkStatus === 'Seen' ) {
				
				 if(!isTestMod){
					 // Ako nije uključen TEST mod - uradi izmene na serveru.
					 $.ajax({
						url: '/api/purchase-invoice/accept-reject',
						method: 'POST',
						contentType: "application/json",
						dataType: "json",
						data: JSON.stringify({ 
							"InvoiceId": checkInvoiceId,
							"Accepted": true
						}),
						headers: {
							"Companyid": response.ReceiverId
						},
						success: function(res, textStatus, xhr) {
							
							if( textStatus == "nocontent" || xhr.status != 200 || !res ) {
								return;
							}
							
							if (res.Status === 'Approved') {
								console.log('Faktura sa brojem ' + res.InvoiceNumber + ' je odobrena.');
							} else {
								console.log('Faktura sa brojem ' + res.InvoiceNumber + ' NIJE odobrena, desila se greška u eFakture sistemu');
							}
							  
							rezultat.push( {"faktura": res.InvoiceNumber, "old_status": checkStatus, "new_status": res.Status} );

						},
						error: function(xhr, status, error) {
							console.error('Error in API call');
						}
					  });
				 } else {
					 rezultat.push( {"faktura": checkInvoiceNumber, "old_status": checkStatus, "new_status": checkStatus} );
				 }
				 

			} else {
				rezultat.push( {"faktura": checkInvoiceNumber, "old_status": checkStatus, "new_status": checkStatus} );
				console.log("Server: Račun broj "+checkInvoiceNumber+" nije ažuriran jer nije moguće menjati trenutni status ("+checkStatus+")");
			}
			
		  });
		  
		  promise.fail(function(xhr, status, error) {
			  
			  var errMsg = error;
			  if(xhr.status == 401){
				  errMsg = "ID kompanije nije ispravan. Odjavite se i prijavite pa pokušajte ponovo.";
			  }
			  
			  if( $("#popup").length == 0 ){
				  notif(false, false, errMsg);
			  }
			  
		  });
		

	}); // each end
	
	$.when.apply($, promises).then(function() {
		
		setTimeout(() => { // Nekada server eFaktura ne ažurira status fakture odmah pa je potrebno osvežiti tabelu posle sekund da bi se videle promene
			$(".src-components-DataTableButtonBar-__styles-module___applyFilterButton #btnApply").trigger( "click" ); // Osveži tabelu
			notif(rezultat, isTestMod);
		}, 1100);
	  
	}).always(function() {
		
		setTimeout(() => {
			_this.prop("disabled",false); // Ponovo omogući taster
			$(".ReactTable .-loading").css({"z-index":"","opacity":""}); // Skloni loading
		}, 1100);

    });
}

// Main fn
function init(options) {
	
	var isNightMode = options[0];
	var isNightAuto = options[1];
	var isBulkOdobri = options[2];
	var isReminder = options[3];
	var isTestMod = options[4];

	var isSystemDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? true : false;
	var href = window.location.href;
	
	// Uraditi proveru što pre kako bismo izbegli "white flash" prilikom učitavanja stranice
	// (fn se poziva samo prilikom page refresh)
	checkColorMode(isNightMode, isNightAuto, isSystemDark);
	
	// Detektuj promenu URL-a u SPA
	var previousUrl = '';
	var urlObserver = new MutationObserver(function(mutations) {
	  if (location.href !== previousUrl) {
		  previousUrl = location.href;
			mainApp(location.href);
		}
	});
	const config = {subtree: true, childList: true};
	urlObserver.observe(document, config);
	
	function mainApp(href){

	// SPA menja URL i ne osvežava stranicu - proveri URL
	var isPurchases = ( href.indexOf("/purchases") > -1 && href.indexOf("/purchases/edit") == -1 ) ? true : false;
	
	$(document.body).ready(function() { // Sačekaj da se html učita (samo za first time load)
		
		// Potrebno je i ovde proveriti ako želimo da manipulišemo DOM u zavisnosti od Night mode
		// (fn se poziva samo prilikom navigacije)
		checkColorMode(isNightMode, isNightAuto, isSystemDark);
		
		// Ako smo na listi ulaznih faktura i ako je korisnik omogućio opciju
		if(isPurchases && isBulkOdobri) {
			
			waitForElm(".src-components-ItemsTablePage-__styles-module___header.src-components-ItemsTablePage-__styles-module___purchaseInvoices").then((elm) => {
				
				// Kreiraj taster ako ne postoji
				if(!document.querySelector('#bulkOdobriWrap')) {
					var btn = document.createElement('div');
					btn.setAttribute('id','bulkOdobriWrap');
					var button = document.createElement('button');
					if(isTestMod){
						button.textContent = 'ODOBRI sve označeno (TEST)';
					} else {
						button.textContent = 'ODOBRI sve označeno';
					}
					button.setAttribute('id','bulkOdobri');
					button.addEventListener('click', function(e) {
						callapi(isReminder, isTestMod);
					});
					button.classList.add('src-components-Button-__styles-module___button', 'u-no-underline', 'src-components-Button-__styles-module___button--meta-inactive');
					btn.appendChild(button);
					
					$(elm).after(btn); // Prikaži taster na stranici
				}
				
			});
		} 

		}); // doc ready
	} // mainApp
	
} // main fn