# Weather Project

Ez egy időjárás alkalmazás, amely aktuális időjárást, előrejelzést és tevékenység-ajánlást kínál az időjárás alapján.

Fő funkciók
- Aktuális időjárás megjelenítése a felhasználó lokációja alapján.
- Kedvenc városok mentése és törlése, böngészőben ip-cím alapján.
- Időjárás előrejelzés több napra.
- Folyton Frissülő idézetek megjelenítése.
- Saját aktivitás-ajánló API.

Projekt célja

A cél egy webes alkalmazás létrehozása, amely valós idejű időjárás és egy egyszerű, saját tevékenység-ajánló API segítségével segít eldönteni, hogy az adott napon milyen tevékenységeket érdemes végezni.


Megvalósítás

A projekt két részből áll:
- Frontend: SvelteKit keretrendszer a UI megjelenítésért és a felhasználói interakciókért.
- Backend: Node.js + Express, felelős az OpenWeather és a saját aktivitásajánló API eléréséért.

A böngésző IP-címe alapján az alkalmazás meghatározza a felhasználó földrajzi pozícióját, majd lekéri az időjárási adatokat és egy ajánlott tevékenységet.


Kódbázis szerkezete

- backend - Szerveroldali logika (Node.js + Express)
server.js
Ez az alkalmazás belépési pontja. Létrehozza az Express szervert és kiszolgálja az időjárási és aktivitásajánló API-kat.

database.js
Egy külön modul, amely a az sqlite táblát definiálja.


- frontend - Felhasználói felület (SvelteKit)
src/routes/+page.svelte
Az alkalmazás főoldala. Itt történik az időjárási adatok megjelenítése, városok kezelése, aktivitás-ajánlás megjelenítése. Komponensként működik, amely minden oldal betöltéskor frissíti az adatokat.



API-k

1. OpenWeather API
- Az aktuális időjárás és előrejelzés lekérésére.
- Hívás: 
  - `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric`
  - `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric`
- Válasz: JSON, amely tartalmazza a hőmérsékletet, időjárási körülményeket stb.

2. Saját Activity Recommendation API
- **URL**: `http://localhost:5173/activity/recommend?lat={lat}&lon={lon}`
- **Válasz**: Egy tevékenység javaslat.
- **Logika**: Jelenleg egyszerű, hőmérséklet és napsütés/eső/hó alapján dönt.



Tárolt adatok

- Felhasználói kedvenc városok a database.sqlite adatbázisban tárolódnak.
- Időjárási adatok: Nem kerülnek tárolásra – minden betöltéskor újra lekérésre kerülnek az OpenWeather API-ból.



Kommunikáció módja

- A frontend `fetch()` hívásokkal kommunikál a backend-el.
- A backend továbbítja a kérést az OpenWeather API felé, majd a választ visszaküldi a frontendnek.
- Minden API hívás JSON formátumban történik.

Használat:
- cd backend -> node server.js 
- npm run dev
