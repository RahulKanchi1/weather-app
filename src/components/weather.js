import axios from 'axios';
import React, { useState } from 'react';
import './weather.css';

import cloudy from '../assests/cloudy.png';
import mist from '../assests/mist.png';
import sunny from '../assests/sunny.png';
import defaultImage from '../assests/defalut.png'; 
import rain from '../assests/Rainny.png';


function Weather() {
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Bengaluru');
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [ind , setInd] = useState(0)
  const images = [defaultImage, cloudy, mist, sunny, rain];

  const fetchWeather = async () => {
    const options = {
      method: 'GET',
      url: `https://open-weather13.p.rapidapi.com/city/${city}/${country}`,
      headers: {
        'x-rapidapi-key': '55b77dc763msh63765f27a73b455p11b767jsn4fd9a2d7788a',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
      },
    };

    try {
      setError(''); // Clear previous errors
      const response = await axios.request(options);
      setInfo(response.data);
      updateWeatherImage(response.data.weather[0]?.main);
    } catch (error) {
      setInfo(null); // Clear previous data on error
      setError('Unable to fetch weather data. Please check the city and country names.');
      console.error(error);
    }
  };

  const cel = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
  const updateWeatherImage = (condition) => {
    const lowerCondition = condition?.toLowerCase() || '';
    if (lowerCondition.includes('clear')) setInd(3);
    else if (lowerCondition.includes('mist')) setInd(2);
    else if (lowerCondition.includes('rain')) setInd(4);
    else if (lowerCondition.includes('cloud')) setInd(1);
    else setInd(0);
  };
  const getWeatherCondition = () => {
    if (!info || !info.weather || !info.weather[0]?.main) return 'Weather is unpredictable right now!';
    const condition = info.weather[0].main.toLowerCase();
    if (condition.includes('clear')) return 'It is sunny today!';
    if (condition.includes('mist')) return 'It is misty today!';
    if (condition.includes('rain')) return 'It is rainy today!';
    if (condition.includes('cloud')) return 'It is cloudy today!';
   
    return 'Weather is unpredictable right now!';
  };

  return (
    <div className="main">
      <div className="weather-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter the city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="in"
          />
          <input
            type="text"
            placeholder="Enter the country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="in"
          />
          <button onClick={fetchWeather} className="but">Enter</button>
        </div>

        {error && <p className="error">{error}</p>}

        {info && (
          <div className="weather-info">
               <img src={images[ind]} alt="weather-icon" />
             <div className='maindata'>  <h1> {cel(info.main?.temp).toFixed(2)}°C</h1>
             <h3>{getWeatherCondition()}</h3></div>
              <div className='sidedata'> 
              <p>Weather: {info.weather[0]?.description}</p>
            
            <p>Humidity: <b> {info.main?.humidity}%</b></p>
            <p>Max Temperature: <b>{cel(info.main?.temp_max).toFixed(2)}°C</b></p>
            <p>Wind Speed: <b>{info.wind?.speed} m/s</b></p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
