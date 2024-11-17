import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherDashboard = () => {
  const [location, setLocation] = useState('London');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=YOUR_API_KEY&units=metric`);
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeatherData();
  }, [location]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const currentWeather = weatherData.list[0];
  const forecast = weatherData.list.slice(1, 6);

  return (
    <div className="weather-dashboard">
      <h1>Weather Dashboard</h1>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
      />
      <div className="current-weather">
        <h2>Current Weather</h2>
        <p>Temperature: {currentWeather.main.temp}°C</p>
        <p>Humidity: {currentWeather.main.humidity}%</p>
      </div>
      <div className="weather-forecast">
        <h2>Weather Forecast</h2>
        <ul>
          {forecast.map((day, index) => (
            <li key={index}>
              <p>Date: {new Date(day.dt * 1000).toLocaleDateString()}</p>
              <p>Temperature: {day.main.temp}°C</p>
              <p>Humidity: {day.main.humidity}%</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="weather-graph">
        <h2>Temperature and Precipitation Trends</h2>
        <svg width="400" height="200">
          {/* Graph implementation can be added here */}
        </svg>
      </div>
    </div>
  );
};

export default WeatherDashboard;