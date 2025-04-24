// src/lib/weather.js
export async function getWeather(city) 
{
    const apiKey = '2bcdd1e9156ac058e92c2afa144997da'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}
