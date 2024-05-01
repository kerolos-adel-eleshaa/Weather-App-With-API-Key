// app.js
let favoriteCities = [];

async function getWeather() {
  try {
    const position = await getCurrentLocation();
    const weatherData = await fetchWeatherData(
      position.coords.latitude,
      position.coords.longitude
    );
    displayWeather(weatherData);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

function fetchWeatherData(latitude, longitude) {
  const unit = document.getElementById("unit-toggle").value;
  const apiKey = "d4669796923fecd0c2a672f7ffd9c725";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

  return fetch(apiUrl).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText || "Weather data not available");
    }
    return response.json();
  });
}

function displayWeather(data) {
  const temperatureUnit =
    document.getElementById("unit-toggle").value === "metric" ? "°C" : "°F";
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const cityName = data.name;

  document.getElementById("weather-info").innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature} ${temperatureUnit}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function addCity() {
  const cityName = prompt("Enter city name:");
  if (cityName) {
    favoriteCities.push(cityName);
    updateCityList();
    getWeather();
  }
}

function updateCityList() {
  const cityListElement = document.getElementById("city-list");
  cityListElement.innerHTML = "";
  favoriteCities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeatherByCity(city);
    cityListElement.appendChild(li);
  });

  // تم الإضافة: حفظ المدن المفضلة في localStorage
  localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
}

function getWeatherByCity(cityName) {
  fetchWeatherDataByCity(cityName)
    .then(displayWeather)
    .catch((error) => console.error("Error:", error.message));
}

function fetchWeatherDataByCity(cityName) {
  const unit = document.getElementById("unit-toggle").value;
  const apiKey = "d4669796923fecd0c2a672f7ffd9c725";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${apiKey}`;

  return fetch(apiUrl).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText || "Weather data not available");
    }
    return response.json();
  });
}

function updateConnectionStatus(online) {
  const connectionStatusElement = document.getElementById("connection-status");
  connectionStatusElement.textContent = online ? "Online" : "Offline";
  connectionStatusElement.style.color = online ? "green" : "red";
}

window.addEventListener("online", () => updateConnectionStatus(true));
window.addEventListener("offline", () => updateConnectionStatus(false));
updateConnectionStatus(navigator.onLine);

// تم الإضافة: تحميل المدن المفضلة عند بداية التطبيق
function loadFavoriteCities() {
  const storedCities = localStorage.getItem("favoriteCities");
  if (storedCities) {
    favoriteCities = JSON.parse(storedCities);
    updateCityList();
  }
}

loadFavoriteCities();
