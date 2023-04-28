document.getElementById("search").addEventListener("click", function (event) {

  const city = document.getElementById("city").value;
  if (city.length < 1) {
    alert("Please enter a city name");
  } else {
    searchCity(city);
  }

});

function searchCity(city) {

  const currentWeather = document.getElementById("weather");
  currentWeather.innerHTML = "Loading";
  const apiKey = "7a56cac986d863a5735c46c03bbac459";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod == "404") {
        alert("City Not Found, Please try again");
      } else {
        const currentWeather = document.getElementById("weather");
        const weather_icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        currentWeather.style.border = "1px solid #000"
        currentWeather.innerHTML = `
      <h2 class="c_h">${data.name} (${new Date().toLocaleDateString()})<img src="${weather_icon}" alt="${data.weather[0].description}"></h2>
      <p>Temperature: ${data.main.temp}K</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

        const apiKey = "7a56cac986d863a5735c46c03bbac459";
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`)
          .then((response) => response.json())
          .then((data) => {
            var forecastData = data.list;
            const forecast_detail = document.getElementById("forecast");
            let output = `<h1>5-Day Forecast:</h1><div class="card-container">`;
            for (let i = 0; i < forecastData.length; i += 8) {
              const weather_icon = `https://openweathermap.org/img/w/${forecastData[i].weather[0].icon}.png`;
              const date = new Date(forecastData[i].dt * 1000).toLocaleDateString();
              output += `
              <div class="card">
          <h3>${date}</h3>
          <img src="${weather_icon}" alt="${forecastData[i].weather[0].description}">
          <p>Temperature: ${forecastData[i].main.temp}K</p>
          <p>Wind Speed: ${forecastData[i].wind.speed} m/s</p>
          <p>Humidity: ${forecastData[i].main.humidity}%</p>
        </div>
        
      `;
            }
            output += "</div>"
            forecast_detail.innerHTML = output;
          });

        const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        if (!searchHistory.includes(city)) {
          const newSearchHistory = [city];
          const updatedSearchHistory = newSearchHistory.concat(searchHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedSearchHistory));
        }
        load_history();
      }
    });
}

function load_history() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const searchHistoryDiv = document.getElementById("search-history");
  searchHistoryDiv.innerHTML = "";

  searchHistory.forEach((city) => {
    const cityButton = document.createElement("button");
    cityButton.textContent = city;
    cityButton.classList.add("history_btn");
    cityButton.addEventListener("click", () => {
      searchCity(city);
    });
    searchHistoryDiv.appendChild(cityButton);
  });
}
load_history();
