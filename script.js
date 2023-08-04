// Initialize dayjs with required plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Define global variables for the search history and current city
let searchHistory = [];

// Function to get the weather data for a city
function getWeather(city) {
  const apiKey = '1697afd7e54090227fc552a6aa169f10'; 
  const weatherInfoDiv = document.getElementById('today');

  // Make a request to OpenWeatherMap API
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;

      // Display weather information
      weatherInfoDiv.innerHTML = `
        <h2>Weather in ${city}</h2>
        <p><strong>Description:</strong> ${weatherDescription}</p>
        <p><strong>Temperature:</strong> ${temperature} &#8451;</p>
        <p><strong>Humidity:</strong> ${humidity} %</p>
      `;
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      weatherInfoDiv.innerHTML = '<p>Unable to fetch weather data.</p>';
    });
}

// Function to add city to the search history
function addToSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);

    // Limit the search history to 5 cities
    if (searchHistory.length > 5) {
      searchHistory.shift(); // Remove the oldest city
    }

    // Update the search history list on the page
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
    for (const cityItem of searchHistory) {
      const historyItem = document.createElement('a');
      historyItem.classList.add('list-group-item', 'list-group-item-action');
      historyItem.textContent = cityItem;
      historyItem.addEventListener('click', () => {
        getWeather(cityItem);
      });
      historyDiv.appendChild(historyItem);
    }
  }
}

// Event listener for the form submission
document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const city = document.getElementById('cityInput').value;
  addToSearchHistory(city);
  getWeather(city);
});

// Initially, load weather for the first city in the search history, if available
if (searchHistory.length > 0) {
  const initialCity = searchHistory[0];
  getWeather(initialCity);
}