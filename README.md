# eFakture Plus
Ovaj dodatak (add-on) proširuje mogućnosti sajta eFakture tako što dodaje opcije koje korisnicima često trebaju. Nezvaničan dodatak.

## Trenutno dostupne opcije:

### #1 Masovno prihvatanje/odobravanje faktura
Korisnik može čekirati/označiti više faktura sa spiska i jednim klikom ih sve odobriti, tj. prihvatiti. Ova opcija je korisna ukoliko korisnik dobija dosta faktura koje treba samo da prihvati bez dodatnih akcija. Sve fakture koje su označene, a imaju status "Nova" ili "Pregledana", će biti automatski odobrene/prihvaćene i dobiće status "Odobrena".

### #2 Test režim
Korisnik može uključiti ovu opciju ako želi da vidi kako funkcioniše prva opcija. Ukoliko je test režim uključen, fakture neće biti odobrene na serveru. Ipak, zbog toga kako je sajt eFakture pravljen, čak i u test režimu fakture sa statusom "Nove" će dobiti status "Pregledane" (ali nijedna faktura neće biti prihvaćena).

### #3 Noćni mod sajta
Ako je ova opcija uključena, sajt eFakture će biti prijatniji za korišćenje noću. Pozadina će biti tamne boje dok će tekst biti svetle boje. Uz ovu opciju dostupna je i opcija "Uskladi sa sistemom" koja će se pobrinuti da sajt bude u noćnom režimu samo dok je sistem/browser korisnika u noćnom režimu.

### #4 Potvrda o akciji
Budući da nakon odobrenja fakture njen status ne može biti vraćen, podrazumevano je uključena dodatna mera zaštite od slučajnog klika. Dok je ova opcija aktivna, kada korisnik klikne "Odobri sve označene fakture" pojaviće se dodatna poruka gde korisnik mora da potvrdi svoj izbor. Ako korisnik ne želi da se pojavljuje dodatna poruka za potvrdu akcije, može je isključiti pomoću ove opcije.

## Instaliraj
- [Chromium Browser-i (Chrome, Edge, Brave...)](https://chromewebstore.google.com/detail/efakture-plus/egcpfbajfklgmfgagjendmplnhbpfeeh)
- [Firefox](https://www.saznajnovo.com/addons/efaktureplus/efaktureplus.xpi)

# Slike
![Opcije dodatka](https://github.com/stefanmm/efakture-plus/blob/main/slike/4.png?raw=true)
![Opcije dodatka](https://github.com/stefanmm/efakture-plus/blob/main/slike/1.png?raw=true)
![Opcije dodatka](https://github.com/stefanmm/efakture-plus/blob/main/slike/2.png?raw=true)
![Opcije dodatka](https://github.com/stefanmm/efakture-plus/blob/main/slike/3.png?raw=true)

# Napomene:
- Dodatak koristi računar korisnika za vršenje akcija na sajtu eFakture. Sva interakcija sa sajtom preko ovog dodatka je identična onoj koju korisnik obavlja kada surfuje sajtom klasičnim putem. Sav saobraćaj je validan i dolazi direktno od korisnika.
- Ovaj dodatak ne čita niti prikuplja podatke o korisniku, uređaju korisnika, veb pregledaču korisnika, niti bilo kakve podatke sa sajta eFakture. Dodatak radi isključivo lokalno na uređaju korisnika i ne komunicira sa udaljenim serverom.
- Dodatak koristi zvanične API krajnje tačke sajta eFakture koje su inače dostupne korisniku. Dodatak ne pristupa podacima kojima korisnik ne bi inače imao pristup.
- Takođe, dodatak ne pristupa sesiji korisnika, kolačićima ili bilo kojim drugim osetljivim podacima.
- Ovaj dodatak je kreiran isključivo kako bi olakšao korisnicima korišćenje pomenutog sajta.
- Dodatak je open-source i njegov izvorni kod je javno dostupan svima: https://github.com/stefanmm/efakture-plus/

# Dozvole dodatka:
- "storage": potrebno za skladištenje podešavanja dodatka kao i za pristup lokalno uskladištenom ID broju kompanije koju je korisnik u tom trenutku izabrao.
- "https://*.efaktura.mfin.gov.rs/*" i "https://*.demoefaktura.mfin.gov.rs/*": dodatak ima pristup samo ovim sajtovima i neće se pokretati na drugim

# Programer:
- Ako pronađete grešku prijavite je na s@sn.rs
- Posetite moj sajt: https://www.stefanmarjanov.com/
- Posetite moj blog: https://www.saznajnovo.com/