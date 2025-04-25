const sqlite3 = require('sqlite3').verbose();

// Adatbázis létrehozása vagy megnyitása
const db = new sqlite3.Database('./database.sqlite', (err) => 
{
    if (err) {console.error('Hiba az adatbázis megnyitásakor:', err.message);} 
    else {console.log('Csatlakozva az SQLite adatbázishoz.');}
});

// Tábla létrehozása, ha nem létezik
db.run(`CREATE TABLE IF NOT EXISTS saved_cities 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        UNIQUE(city, ip_address)
    )`, (err) => {
    if (err) {console.error('Hiba az adatbázis táblájának létrehozásakor:', err.message);} 
    else {console.log('Saved cities tábla létrehozva.');}
    });
module.exports = db;
