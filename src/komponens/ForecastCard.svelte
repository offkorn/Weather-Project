
<script>
    export let day;
</script>
  
  <div class="forecast-card">
    <h3 id="City">{day.dayName}</h3>
    <h1 id="Temp">{Math.round(day.temp)} °C</h1>
    <p id="WetterName">{day.weather}</p>
    <p style="color: aquamarine;">
      <img src="/images/cloud.png" alt="Cloud Icon" width="60" height="40" style="margin: 0,0,0,20;" />
      {day.cloudiness} %
    </p>
    <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="Weather Icon" />
  </div>
  
  <style>
    .forecast-card 
    {
      background: rgba(118, 148, 193, 0.459);
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      min-width: 150px;
      margin: 10px;
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