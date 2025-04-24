<script>
    export let weatherData;
  </script>
  

    <div class="weather-card">
      <h2 id="City">{weatherData.name}, {weatherData.sys.country}</h2>
      <h1 id="Temp">{Math.round(weatherData.main.temp)} °C</h1>
      <h3 id="WetterName">{weatherData.weather[0].description}</h3>
      <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather Icon" />
      <p>💨 {weatherData.wind.speed} m/s</p>
      <p>💧 {weatherData.main.humidity} %</p>
      <p>🌅 {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p>🌇 {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
    </div>


    
  <style>

    .weather-card
     {
      background: rgb(36, 57, 82);
      padding: 15px;
      border-radius: 10px;
      min-width: 500px;
     }
  
  
    #WetterName 
    {
      color: skyblue;
    }
  
    #City 
    {
      color: white;
    }
  
    #Temp 
    {
      color: rgb(255, 200, 82);
    }


  </style>