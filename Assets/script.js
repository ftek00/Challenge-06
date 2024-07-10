document.addEventListener("DOMContentLoaded", function () {
  const cityInput = document.getElementById("cityInput");
  const cityButton = document.getElementById("cityButton");
  const searchHistoryContainer = document.getElementById(
    "searchHistoryContainer"
  );
  const currentWeather = document.getElementById("currentWeather");
  const futureWeather = document.getElementById("futureWeather");

  function getWeather(city) {
    const apiKey = "f209a958e2983936d2cd31398fee2ef1";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const weatherData = {
          city: data.name,
          date: new Date(data.dt * 1000).toLocaleDateString(),
          temperature: Math.round(data.main.temp - 273.15),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
        };
        displayCurrentWeather(weatherData);

        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
        return fetch(forecastApiUrl);
      })
      .then((forecastResponse) => forecastResponse.json())
      .then((forecastData) => {
        const fiveDayForecast = forecastData.list.filter(
          (item, index) => index % 8 === 0
        );
        displayFutureWeather(fiveDayForecast);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  cityButton.addEventListener("click", function () {
    const cityName = cityInput.value;
    getWeather(cityName);
    saveToLocalStorage(cityName);
    displaySearchHistory();
  });
  function displayCurrentWeather(weatherData) {
    currentWeather.innerHTML = `
        <p style="font-size: 24px; font-weight: bold;">${weatherData.city}</p>
        <p style="font-size: 24px;">${weatherData.date}</p>
        <p>Temp: ${weatherData.temperature}°C</p>
        <p>Humidity: ${weatherData.humidity}%</p>
        <p>Wind Speed: ${weatherData.windSpeed} km/h</p>
        <p><i class="fas fa-${weatherData.icon}"></i></p>
   `;
  }

