//variables
let buttonSearch = document.querySelector("#city-search-button");
let buttonCurent = document.querySelector("#current-city-button");
let dateElement = document.querySelector("#current-date");
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
let cityHeading = document.querySelector("#city");
let temp = document.querySelector("#temp");


let apiKey = "e38520d0ab3c1731aad20e98add71987";

function getFormatDate(timestamp) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  return timestamp.toLocaleDateString("en-US", options);
}
dateElement.innerHTML = getFormatDate(new Date());

function getFahrenheit(event) {
  event.preventDefault();
  let countTemp = Number(temp.textContent);
  let newTemperature = Math.floor(countTemp * 1.8 + 32);
  temp.innerHTML = newTemperature;
}
fahrenheit.addEventListener("click", getFahrenheit);

function getCelsius(event) {
  event.preventDefault();
  let countTemp = Number(temp.textContent);
  let newTemperature = Math.ceil((countTemp - 32) / 1.8);
  temp.innerHTML = newTemperature;
}
celsius.addEventListener("click", getCelsius);

function showWeather(response) {
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let icon = document.querySelector("#main-icon");
  let roundTemp = Math.round(response.data.main.temp);
  temp.innerHTML = roundTemp;
  description.innerHTML = `${response.data.weather[0].main}`;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${response.data.wind.speed} m/s`;
  icon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  icon.setAttribute("alt", response.data.weather[0].main);
  unixDate = response.data.dt * 1000;
  unixDate = new Date(unixDate);
  dateElement.innerHTML = getFormatDate(unixDate);
}

function getCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  if (city) {
    cityHeading.innerHTML = city;   
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showWeather);
  }
}
buttonSearch.addEventListener("click", getCity);

function currentCity() {
  function showCurrentWeather(response) {
    let city = response.data.name;
    cityHeading.innerHTML = city;
    showWeather(response);
    console.log(response)
  }

  function getCurrentCity(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}&units=metric`;
    axios.get(url).then(showCurrentWeather);    
  }
  navigator.geolocation.getCurrentPosition(getCurrentCity);
}
currentCity();
buttonCurent.addEventListener("click", currentCity);


//change behavior of units