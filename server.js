const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const app = express();
const port = 3000;
const openWeatherAPIKey = '2bcdd1e9156ac058e92c2afa144997da'; // OpenWeather API kulcs
const requestIp = require("request-ip");


// Adatbázis kapcsolat létrehozása
const db = require('./database');


// Middleware
app.use(express.json());
app.use(cors());
app.use(requestIp.mw()); // IP címek lekérése



// Város mentése IP alapján
app.post('/api/saved-cities', async (req, res) => {
    const { city } = req.body;
    const ip = req.ip; // vagy req.headers['x-forwarded-for']

    if (!city) {
        return res.status(400).json({ error: 'A város neve kötelező.' });
    }

    db.run('INSERT INTO saved_cities (city, ip_address) VALUES (?, ?)', [city, ip], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, city });
    });
});

// Elmentett városok lekérése IP alapján
app.get('/api/saved-cities', (req, res) => {
    const ipAddress = req.clientIp || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    db.all('SELECT city FROM saved_cities WHERE ip_address = ?', [ipAddress], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//mentett város Delete
app.delete('/api/saved-cities/:cityName', (req, res) => {
    const { cityName } = req.params; // Város neve a URL-ből
    const ipAddress = req.ip; // IP cím a kérésből

    console.log(`Törlés kérése: Város: ${cityName}, IP cím: ${ipAddress}`);

    const sql = `DELETE FROM saved_cities WHERE LOWER(city) = LOWER(?) AND ip_address = ?`;

    db.run(sql, [cityName, ipAddress], function(err) {
        if (err) {
            console.error('Hiba a törlés során:', err.message);
            return res.status(500).json({ message: 'Hiba történt a város törlésénél', error: err });
        }

        if (this.changes === 0) {
            console.log(`Nincs törlés: A '${cityName}' város nem található az IP címhez rendelve.`);
            return res.status(404).json({ message: `A város '${cityName}' nem található az IP címhez rendelve!` });
        }

        console.log(`Sikeres törlés: '${cityName}' város törölve.`);
        res.status(200).json({ message: `A '${cityName}' város sikeresen törölve!` });
    });
});



app.get('/activity/recommend', async (req, res) => 
    {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).send("Kérlek add meg a hely koordinátákat.");
    }

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=metric`);
        const weatherData = weatherResponse.data;

        const weather = weatherData.weather[0].main;
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        let activity;

        if (weather === 'Rain') {
            activity = "reading, watching movie, cooking.";
        } else if (weather === 'Clear') {
            if (temperature > 25) {
                activity = "swimming, sunbathing, drinking cold beverages.";
            } else if (temperature < 10) {
                activity = "hiking, running, go for a walk with a jacket.";
            } else {
                activity = "hiking, running, go for a walk.";
            }
        } else if (weather === 'Snow') {
            activity = "Winter sports: skiing, building a snowman, ice skating.";
        } else if (windSpeed > 10) {
            activity = "Stay indoors, maybe try yoga or meditation.";
        } else {
            activity = "Enjoy the day";
        }

        res.json({ activity, weather, temperature, humidity, windSpeed });
    } catch (error) {
        console.error(error);
        res.status(500).send("Hiba történt az aktivitás lekérésekor.");
    }
});

// Szerver indítása
app.listen(port, () => {
    console.log(`API fut a http://localhost:${port}`);
});
