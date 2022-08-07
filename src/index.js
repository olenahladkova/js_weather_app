//variables
let buttonSearch = document.querySelector("#city-search-button");
let buttonCurent = document.querySelector("#current-city-button");
let dateElement = document.querySelector("#current-date");
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
let cityHeading = document.querySelector("#city");
let temp = document.querySelector("#temp");
let celsiusTemp = null;

let apiKey = "e38520d0ab3c1731aad20e98add71987";

function formatDate(timestamp) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  return timestamp.toLocaleDateString("en-US", options);
};
dateElement.innerHTML = formatDate(new Date());

function formatForecastDate(timestamp) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return timestamp.toLocaleDateString("en-US", options);
};

function getFahrenheit(event) {
  event.preventDefault();
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let newTemp = Math.floor(celsiusTemp * 1.8 + 32);
  temp.innerHTML = newTemp;
};
fahrenheit.addEventListener("click", getFahrenheit);

function getCelsius(event) {
  event.preventDefault();
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
  temp.innerHTML = celsiusTemp;
};
celsius.addEventListener("click", getCelsius);

function getCoordinates(coordinates) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(forecastApiUrl).then(displayForecast);
};

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach((forecastDay, index) => {
    if (index > 0 && index < 6) {
      forecastHTML = forecastHTML + `
        <div
          class="col-sm m-2 p-2 bg-transparent shadow rounded text-center forecast" id="forecast"
          style="--bs-bg-opacity: 0.5;"
          >
          <h5>${formatForecastDate(new Date(forecastDay.dt * 1000))}</h5>
          <img 
            src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" 
            alt="${forecastDay.weather[0].main}" 
          />
          <h4>
            <span>${Math.round(forecastDay.temp.day)}</span>°C / 
            <span>${Math.round(forecastDay.temp.night)}</span>°C
          </h4>
          <p>${forecastDay.weather[0].main}</p>
        </div>
        `;
    }
  })
  forecastElement.innerHTML = forecastHTML;
};

function showWeather(response) {
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let icon = document.querySelector("#main-icon");
  celsiusTemp = Math.round(response.data.main.temp);
  temp.innerHTML = celsiusTemp;
  description.innerHTML = `${response.data.weather[0].main}`;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${response.data.wind.speed} m/s`;
  icon.setAttribute("src", 
                  `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
                  );
  icon.setAttribute("alt", response.data.weather[0].main);
  unixDate = response.data.dt * 1000;
  unixDate = new Date(unixDate);
  dateElement.innerHTML = formatDate(unixDate);
  getCoordinates(response.data.coord);
};

function getCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  if (city) {
    cityHeading.innerHTML = city;   
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showWeather);
  }
};
buttonSearch.addEventListener("click", getCity);

function currentCity() {
  function showCurrentWeather(response) {
    let city = response.data.name;
    cityHeading.innerHTML = city;
    showWeather(response);
  }

  function getCurrentCity(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}&units=metric`;
    axios.get(url).then(showCurrentWeather);    
  }
  navigator.geolocation.getCurrentPosition(getCurrentCity);
};
currentCity();
buttonCurent.addEventListener("click", currentCity);