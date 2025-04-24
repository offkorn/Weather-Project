<script>
    import { onMount } from 'svelte';
    import { weatherStore } from '../store.js';
    import Navbar from '../komponens/Navbar.svelte';
    import { location } from '../store.js'; 
    import WeatherCard from '../komponens/WeatherCard.svelte';
    import ForecastCard from '../komponens/ForecastCard.svelte';

    let weatherData = null;
    let forecastData = [];
    let city = 'Helyi helyzet';
    let quote = "Loading...";
    


    // qoutes lekérése
    async function fetchQuote()
     {
        try {
            const response = await fetch('https://api.adviceslip.com/advice');
            if (!response.ok) throw new Error("Hálózati hiba történt!");

            const data = await response.json();
            return data.slip.advice;  
        } catch (error) {
            console.error("Nem sikerült lekérni az idézetet:", error);
            return "Nem sikerült idézetet betölteni.";
        }
    }



    // Időjárás lekérése
    async function fetchWeatherByLocation() 
    {
        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(async (position) => 
            {
                try 
                {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    location.set({ lat, lon });  //  store.js frissites
                    const apiKey = '2bcdd1e9156ac058e92c2afa144997da';

                    // Aktuális időjárás
                    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                    if (!weatherResponse.ok) throw new Error("Nem sikerült lekérni az időjárást!");

                    const weather = await weatherResponse.json();
                    weatherData = weather;
                    city = weather.name;

                    // 3 napos előrejelzés
                    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                    if (!forecastResponse.ok) throw new Error("Nem sikerült lekérni az előrejelzést!");
                    const forecast = await forecastResponse.json();

                    processForecast(forecast.list);

                    weatherStore.set(weatherData);
                } catch (error) {
                    console.error("Hiba történt az időjárás lekérésekor:", error);
                }
            });
        }
    }

    function processForecast(list) 
    {
        let days = {};

        list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toISOString().split('T')[0]; 

            if (!days[dayKey]) 
            {
                days[dayKey] = 
                {
                    temp: item.main.temp,
                    weather: item.weather[0].description,
                    icon: item.weather[0].icon,
                    cloudiness: item.clouds.all,
                    dayName: getDayName(date)
                };
            }
        });

        forecastData = Object.values(days).slice(1, 4);     
        if (forecastData.length > 0) 
        {
            forecastData[0].dayName = "Tomorrow";   
        }
    }

    function getDayName(date) {return date.toLocaleDateString('en-US', { weekday: 'long' });}


    
    onMount(async () => 
    {
        fetchWeatherByLocation();
        quote = await fetchQuote();
    });
    
    

</script>

<!-- Navbar -->
<Navbar />

<div>
   
    <div class="ActualContainer">
        {#if weatherData}

        <WeatherCard {weatherData} />

        {:else}
            <p>Loading...</p>
        {/if}

    </div>
    
    <hr style="margin-bottom: 40px;">

    <!-- 3 napos forecast -->
    <h2 style="font-size: 25px;"  >3 day forecast</h2>

    <div class="forecast-container">
        {#each forecastData as day}
          <ForecastCard {day} />
        {/each}
      </div>
<hr >

    <h2>Inspirational Quotes:</h2>
    <p class="quote">" {quote} "</p>

</div>

<style>
    div
    {
        padding: 16px;
        font-family: Arial, sans-serif;
        text-align: center;
    }

    

    .ActualContainer 
    {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 20px;
    }


    h2 
    {
        font-size: 20px;
        font-weight: bold;
    }

    p 
    {
        font-size: 18px;
        font-style: italic;
    }

    hr 
    {
        margin: 20px auto; 
        background-color: rgb(194, 245, 255);
        height: 0px;
        border-color: transparent;
        width: 70%;
    }


    
    .forecast-container 
    {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 20px;
    }
    

    .quote
    {
        color: rgba(183, 255, 0, 0.919);
        font-size: large;
    }
   

    

</style>
