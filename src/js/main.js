import WeatherService from "./services/WeatherService.js";

// Function to toggle the sidebar visibility for mobile
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
}

// Function to "loading-spinner"
function showLoading() {
    document.body.classList.add('loading');
}

function hideLoading() {
    document.body.classList.remove('loading');
}

// Function to get current location
function showError(message, duration = 3000) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, duration);
}

async function getCurrentLocation() {
    if (navigator.geolocation) {
        try {
            showLoading();
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const weatherData = await WeatherService.fetchWeatherByCoordinates(latitude, longitude);
            displayWeather(weatherData);
        } catch (error) {
            console.error("Geolocation error:", error);
            showError("Unable to get your location. Please enter it manually.");
        } finally {
            hideLoading();
        }
    } else {
        showError("Geolocation is not supported by your browser");
    }
}

// Function to handle the weather data fetching and display
async function fetchWeather(location) {
    showLoading();
    try {
        const weatherAPIData = await WeatherService.fetchWeatherAPI(location);
        displayWeather(weatherAPIData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Could not fetch weather data. Please try again.");
    } finally {
        hideLoading();
    }
}

// Function to display the weather data in the DOM
function displayWeather(weatherData) {
    if (!weatherData || !weatherData.current) {
        document.getElementById("temperature").textContent = "No data available";
        alert("Weather data unavailable for this location. Please try a different location.");
        return;
    }

    // Current weather details
    document.getElementById("temperature").textContent = `${weatherData.current.temp_c}°C`;
    document.getElementById("weather-icon").src = weatherData.current.condition.icon;

    // Capitalize the first letter of the weather description
    const weatherDescription = weatherData.current.condition.text;
    document.getElementById("weather-description").textContent = weatherDescription;
    document.getElementById("feels-like").textContent = `Feels like: ${weatherData.current.feelslike_c}°C`;

    // Display the current location and date
    const location = `${weatherData.location.name}, ${weatherData.location.country}`;
    document.getElementById("current-location").textContent = location;
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const currentDate = `Today, ${new Date().toLocaleDateString('en-GB', options)}`;
    document.getElementById("current-date").textContent = currentDate;

    // Additional weather information
    document.getElementById("wind-status").innerHTML = `<span class="icon">🌬️</span><span class="label">Wind: ${weatherData.current.wind_kph} kph</span>`;
    document.getElementById("humidity").innerHTML = `<span class="icon">💧</span><span class="label">Humidity: ${weatherData.current.humidity}%</span>`;
    document.getElementById("uv-index").innerHTML = `<span class="icon">☀️</span><span class="label">UV Index: ${weatherData.current.uv}</span>`;

    // Only update dew point if available
    if (weatherData.current.dewpoint_c !== undefined) {
        document.getElementById("dew-point").innerHTML = `<span class="icon">🌫️</span><span class="label">Dew Point: ${weatherData.current.dewpoint_c}°C</span>`;
    }

    // Air Quality Index (AQI)
    const aqi = weatherData.current.air_quality?.["us-epa-index"] ?? "N/A";
    document.getElementById("aqi").innerHTML = `<span class="icon">🏭</span><span class="label">Air Quality Index: ${aqi}</span>`;

    // Update sunrise-sunset if available in the forecast data
    if (weatherData.forecast?.forecastday[0]?.astro) {
        const sunrise = weatherData.forecast.forecastday[0].astro.sunrise;
        const sunset = weatherData.forecast.forecastday[0].astro.sunset;
        document.getElementById("sunrise-sunset").innerHTML =
            `<span class="icon">🌅</span><span class="label">Sunrise: ${sunrise}, Sunset: ${sunset}</span>`;
    }

    // Hourly Forecast
    if (weatherData.forecast?.forecastday[0]?.hour) {
        const hourlyForecastList = document.getElementById("hourly-forecast-list");
        hourlyForecastList.innerHTML = ""; // Clear existing entries

        // Get current hour to only show future hours
        const currentHour = new Date().getHours();

        weatherData.forecast.forecastday[0].hour
            .filter((hour, index) => index >= currentHour)
            .slice(0, 12)
            .forEach(hour => {
                const listItem = document.createElement("li");
                const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                listItem.innerHTML = `
                    <div class="hourly-forecast-item">
                        <span class="time">${time}</span>
                        <img src="${hour.condition.icon}" alt="${hour.condition.text}" class="small-weather-icon">
                        <span class="temp">${hour.temp_c}°C</span>
                    </div>`;
                hourlyForecastList.appendChild(listItem);
            });
    }

    // 7-Day Forecast
    if (weatherData.forecast?.forecastday) {
        const forecastList = document.getElementById("forecast-list");
        forecastList.innerHTML = ""; // Clear existing entries

        weatherData.forecast.forecastday.forEach(day => {
            const date = new Date(day.date);
            const listItem = document.createElement("li");
            listItem.classList.add("forecast-item");

            listItem.innerHTML = `
                <div class="forecast-day">
                    <span class="date">${date.toLocaleDateString([], { weekday: 'long' })}</span>
                    <div class="forecast-details">
                        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="small-weather-icon">
                        <div class="temp-range">
                            <span class="high">H: ${day.day.maxtemp_c}°C</span>
                            <span class="low">L: ${day.day.mintemp_c}°C</span>
                        </div>
                        <p class="condition">${day.day.condition.text}</p>
                    </div>
                </div>`;

            forecastList.appendChild(listItem);
        });
    }
}

// Function to check recent searches
function addToRecentSearches(location) {
    let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    // Remove if already exists
    searches = searches.filter(search => search !== location);
    // Add to beginning
    searches.unshift(location);
    // Keep only last 5 searches
    searches = searches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    displayRecentSearches();
}

function displayRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const container = document.getElementById('recent-searches');
    if (!container) return;
    
    container.innerHTML = '';
    searches.forEach(search => {
        const button = document.createElement('button');
        button.textContent = search;
        button.onclick = () => fetchWeather(search);
        container.appendChild(button);
    });
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const themeIcon = document.getElementById("darkModeToggle");

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        themeIcon.innerHTML = "🌞<span class='icon-label'>Light Mode</span>";
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.innerHTML = "🌙<span class='icon-label'>Dark Mode</span>";
        localStorage.setItem("theme", "light");
    }
}

// Load the saved theme from local storage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeToggle").innerHTML = "🌞<span class='icon-label'>Light Mode</span>";
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadSavedTheme();

    // Add event listener for the search button
    document.getElementById("search-button").addEventListener("click", () => {
        const locationInput = document.getElementById("location-input").value;
        if (locationInput) {
            fetchWeather(locationInput);
        } else {
            alert("Please enter a location");
        }
    });

    // Add event listener for the Enter key in the search input
    document.getElementById("location-input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const locationInput = document.getElementById("location-input").value;
            if (locationInput) {
                fetchWeather(locationInput);
            } else {
                alert("Please enter a location");
            }
        }
    });

    // Add event listener for geolocation
    document.getElementById("get-location").addEventListener("click", getCurrentLocation);

    // Add event listener for the menu toggle
    document.getElementById("menu-toggle").addEventListener("click", toggleSidebar);

    // Add event listener for dark mode toggle
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

    displayRecentSearches();
});