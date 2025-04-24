<script>
    import { onMount } from 'svelte';
    import Navbar from '../../komponens/Navbar.svelte';
    import { weatherStore } from '../../store.js';
    import { savedCities } from '../../store.js';
    import UnitSwitcher from '../../komponens/UnitSwitcher.svelte';
    import { preferences } from '../../store.js';
   

    let cities;
    $: cities = $savedCities;
    let city = '';
    let weather = null;
    let errorMessage = '';
    let selectedCity = '';

        // Mértékegység figyelése
    $: unit = $preferences.unit || 'metric';

// Város keresése 
async function fetchWeather() {
    if (!city) return;
    try {
        const apiKey = '2bcdd1e9156ac058e92c2afa144997da';
        const units = $preferences.unit || 'metric'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('City not found or does not exist!');
        const data = await res.json();
        weather = data;
        errorMessage = '';
        selectedCity = city;
    } catch (err) {
        weather = null;
        errorMessage = 'Hiba történt az időjárás lekérésekor!';
        console.error(err);
    }
}

// Mértékegység változásának figyelése
$: {
    if (weather) {
        fetchWeather(); // Újrahívjuk a fetchWeather-t, ha a mértékegység változik
    }
}



    // Város mentése
    async function saveCity() 
    {
        if (!selectedCity) return;

        const res = await fetch("http://localhost:3000/api/saved-cities", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: selectedCity }),
        });

        const newCity = await res.json();

        // Frissítjük a savedCities store-t úgy, hogy hozzáadjuk az új várost a listához
        savedCities.update(currentCities => [...currentCities, newCity]);
    }


    // API hívás a mentett városok lekéréséhez
    onMount(async () => 
    {
        try 
        {
            const response = await fetch("http://localhost:3000/api/saved-cities");
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            const data = await response.json();

            // Frissítsük a store értékét a kapott adatokkal
            savedCities.set(data);
        } catch (error) {
            console.error("Hiba a mentett városok lekérésekor:", error);
        }
    });


    //mentett város Delete
    async function deleteCity(cityName) 
    {
        try 
        {
            const response = await fetch(`http://localhost:3000/api/saved-cities/${cityName}`, {method: 'DELETE',});

            if (!response.ok) {throw new Error('Hiba történt a város törlése során.');}

            savedCities.update(currentCities => currentCities.filter(city => city.city !== cityName));
            console.log(`'${cityName}' város sikeresen törölve.`);
        } catch (error) {console.error('Hiba a város törlésekor:', error);}
    }




    function formatTime(timestamp) 
    {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
</script>

<Navbar />

<div>
    <h2>Search Weather</h2>
    <input id="Input" type="text" bind:value={city} placeholder="Type city" />
    <button id="SearchButton" on:click={fetchWeather}>Search</button>
    <button id="SaveButton" on:click={saveCity}>Save</button>

      <UnitSwitcher />

    <div class="SearchWeather">
    {#if weather}
        <h2 id="City">{weather.name}, {weather.sys.country}</h2>
        <h1 id="Temp">{Math.round(weather.main.temp)} {unit === 'metric' ? '°C' : '°F'}</h1>
        <h3 id="WetterName">{weather.weather[0].description}</h3>
        <div id="WetterImage"><img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" /></div>
        <p>💨 {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        <p>💧 {weather.main.humidity} %</p>
        <p>🌅 {formatTime(weather.sys.sunrise)} h</p>
        <p>🌇 {formatTime(weather.sys.sunset)} h</p>
    {:else if errorMessage} 
        <p style="color: red;">{errorMessage}</p>
    {/if}
    </div>

    <h3>Saved Cities</h3>

    <div class="saved-cities">

        <!--
      
        {#each $savedCities as savedCity}
            <button 
                class="city-button {selectedCity === savedCity.city ? 'highlight' : ''}" 
                on:click={() => { 
                    selectedCity = savedCity.city; 
                    fetchWeather(selectedCity); 
                }}
            >
                <span class="city-name">{savedCity.city}</span> -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
       <!--         <span class="delete-btn" on:click={(e) => { e.stopPropagation(); deleteCity(savedCity.city); }}>X</span>
            </button>
        {/each}
-->

{#each $savedCities as savedCity}
<button 
    class="city-button {selectedCity === savedCity.city ? 'highlight' : ''}" 
    on:click={() => 
    { 
        selectedCity = savedCity.city;
        city = selectedCity; 
        fetchWeather(); 
    }}>
    <span class="city-name">{savedCity.city}</span>
    <span  style="font-size: 25px;" class="delete-btn" 
        on:click={(e) => 
        { 
            e.stopPropagation(); // Ne terjedjen át a gomb kattintása a fő gombra
            deleteCity(savedCity.city);
        }}> ×
    </span>
</button>
{/each}


   
    </div>
</div>

<style>

    div
    {
        text-align: center;
    }

    .SearchWeather
    {
        background-color: rgb(36, 57, 82);
        padding: 20px;
        border-radius: 10px;
        margin: 30px auto;
        max-width: 400px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    #WetterImage
    {
        background-color: #7fa2b5; 
        padding: 10px;
        border-radius: 10px;
        margin: 30px auto;
        max-width: 150px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    #Input
    {
        border-color: #2c2b2b;
        border-radius: 20px;
        border-width: 2px;
        padding: 10px;
        background-color: transparent;
        color: white;
        box-shadow: none;
        width: 20%;
    }

    #SearchButton
    {
        display: inline-block;
        padding: 10px 15px;
        font-size: 18px;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        outline: none;
        color: #fff;
        background-color: #3b7395;
        border: none;
        border-radius: 15px;
        box-shadow: 0 9px #3d3d3d;
        margin-left: 2%;
        margin-right: 1%;
    }

    #SearchButton:active 
    {
        background-color: #2c492d;
        box-shadow: 0 5px #2c2b2b;
        transform: translateY(4px);
    }

    
    #SaveButton
    {
        display: inline-block;
        padding: 10px 15px;
        font-size: 18px;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        outline: none;
        color: #fff;
        background-color: #bdbb41;
        border: none;
        border-radius: 15px;
        box-shadow: 0 9px #514f4f;
    }

    #SaveButton:active 
    {
        background-color: #bdbb41ad;
        box-shadow: 0 5px #2c2b2b;
        transform: translateY(4px);
    }

    #WetterName
    {
        color: skyblue;
    }

    #City
    {
        color:white;
    }

    #Temp
    {
        color: rgb(255, 200, 82);
    }


    .saved-cities 
    {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        overflow-x: auto;
        white-space: nowrap;
    }

      
    .city-button
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 100px;
        padding: 8px 15px;
        font-size: 15px;
        background-color: #4f6d8293;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.3s;
        position: relative;
    }

    .city-button.highlight 
    {
        background-color: #4cafa8da;
        color: white;
    }
 

    .city-name 
    {
        flex-grow: 1; 
        text-align: center;
    }

    .delete-btn 
    {
        background-color: transparent;
        color: white;
        font-weight: bold;
        border-radius: 50%; 
        font-size: 20px;
        padding-right: 1%;
        margin-left: 20px;
    }

    .delete-btn:hover 
    {
        color: red;
    }
    

</style>
