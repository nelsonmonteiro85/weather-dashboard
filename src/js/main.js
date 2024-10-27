import WeatherService from "./services/WeatherService.js";
import UIController from "../js/components/UIController.js";
import AlertManager from "../js/components/AlertManager.js";

// Function to toggle the sidebar visibility for mobile
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
}

// Function to handle the weather data fetching and display
async function fetchWeather(location) {
    try {
        const openWeatherData = await WeatherService.fetchOpenWeather(location);
        const weatherAPIData = await WeatherService.fetchWeatherAPI(location);

        // Log the entire response data
        console.log("OpenWeather Data:", JSON.stringify(openWeatherData, null, 2));
        console.log("WeatherAPI Data:", JSON.stringify(weatherAPIData, null, 2));

        displayWeather(openWeatherData, weatherAPIData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Could not fetch weather data. Please try again.");
    }
}

// Function to display the weather data in the DOM
function displayWeather(openWeatherData, weatherAPIData) {
    // Check if data is available
    if (!openWeatherData || !weatherAPIData) {
        document.getElementById("temperature").textContent = "No data available";
        alert("Weather data unavailable for this location. Please try a different location.");
        return;
    }

    // Current weather details
    document.getElementById("temperature").textContent = `${openWeatherData.main.temp}°C`;
    document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${openWeatherData.weather[0].icon}.png`;

    // Capitalize the first letter of the weather description
    const weatherDescription = openWeatherData.weather[0].description;
    document.getElementById("weather-description").textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    document.getElementById("feels-like").textContent = `Feels like: ${openWeatherData.main.feels_like}°C`;

    // Display the current location
    const location = openWeatherData.name;
    document.getElementById("current-location").textContent = location;

    // Display the current date
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const currentDate = `Today, ${new Date().toLocaleDateString('en-GB', options)}`;
    document.getElementById("current-date").textContent = currentDate;

    // Additional weather information
    document.getElementById("wind-status").textContent = `🌬️ Wind: ${weatherAPIData.current.wind_kph} kph`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${weatherAPIData.current.humidity}%`;
    document.getElementById("uv-index").textContent = `☀️ UV Index: ${weatherAPIData.current.uv}`;
    document.getElementById("dew-point").textContent = `🌫️ Dew Point: ${weatherAPIData.current.dewpoint_c}°C`;

    // Air Quality Index (AQI) with fallback if missing
    const aqi = weatherAPIData.current?.air_quality?.["us-epa-index"] ?? "N/A";
    document.getElementById("aqi").textContent = `🏭 Air Quality Index: ${aqi}`;

    // Sunrise and Sunset times
    const sunrise = new Date(openWeatherData.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(openWeatherData.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById("sunrise-sunset").textContent = `🌅 Sunrise: ${sunrise}, Sunset: ${sunset}`;

    // Hourly Forecast
    if (weatherAPIData.forecast && weatherAPIData.forecast.forecastday[0].hour) {
        const hourlyForecastList = document.getElementById("hourly-forecast-list");
        hourlyForecastList.innerHTML = ""; // Clear any existing entries
        weatherAPIData.forecast.forecastday[0].hour.slice(0, 12).forEach(hour => {
            const listItem = document.createElement("li");
            const time = new Date(hour.time_epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            listItem.textContent = `${time}: ${hour.temp_c}°C, ${hour.condition.text}`;
            hourlyForecastList.appendChild(listItem);
        });
    }

    // 7-Day Forecast
    if (weatherAPIData.forecast && weatherAPIData.forecast.forecastday) {
        const forecastList = document.getElementById("forecast-list");
        forecastList.innerHTML = ""; // Clear any existing entries

        weatherAPIData.forecast.forecastday.forEach(day => {
            const listItem = document.createElement("li");
            listItem.classList.add("forecast-item"); // Optional: Add a class for styling

            // Create a span for the day of the week
            const dayOfWeek = new Date(day.date).toLocaleDateString([], { weekday: 'long' });
            const dateSpan = document.createElement("span");
            dateSpan.classList.add("date");
            dateSpan.textContent = dayOfWeek;

            // Create a div for the day forecast details
            const dayForecast = document.createElement("div");
            dayForecast.classList.add("day-forecast");

            // Add weather condition
            const condition = document.createElement("p");
            condition.textContent = day.day.condition.text;

            // Add high and low temperature
            const temperatures = document.createElement("p");
            temperatures.textContent = `High: ${day.day.maxtemp_c}°C Low: ${day.day.mintemp_c}°C`;

            // Append condition and temperature to the day forecast div
            dayForecast.appendChild(condition);
            dayForecast.appendChild(temperatures);

            // Append the day of the week and day forecast div to the list item
            listItem.appendChild(dateSpan);
            listItem.appendChild(dayForecast);

            // Append the list item to the forecast list
            forecastList.appendChild(listItem);
        });
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const themeIcon = document.getElementById("darkModeToggle"); // Changed to match the button ID

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        themeIcon.innerHTML = "🌞<span class='icon-label'>Light Mode</span>"; // Change to sun icon
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.innerHTML = "🌙<span class='icon-label'>Toggle Dark Mode</span>"; // Change back to moon icon
        localStorage.setItem("theme", "light");
    }
}

// Load the saved theme from local storage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeToggle").innerHTML = "🌞<span class='icon-label'>Light Mode</span>"; // Set to sun icon
    }
}

// Event listeners
document.getElementById("menu-toggle").addEventListener("click", toggleSidebar);
document.getElementById("search-button").addEventListener("click", () => {
    const locationInput = document.getElementById("location-input").value;
    if (locationInput) {
        fetchWeather(locationInput); // Pass the user's input to fetchWeather
    } else {
        alert("Please enter a location");
    }
});

// Add event listener for dark mode toggle
document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode); // Updated to match the button ID

// Load the saved theme when the page loads
loadSavedTheme();

