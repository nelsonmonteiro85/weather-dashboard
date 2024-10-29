import WeatherService from "./WeatherService.js";
import UIController from "./UIController.js";
import AlertManager from "./AlertManager.js";

// Event listeners for the UI
document.getElementById("search-button").addEventListener("click", async () => {
    const locationInput = document.getElementById("location-input").value;
    if (locationInput) {
        try {
            const weatherData = await WeatherService.fetchOpenWeather(locationInput);
            UIController.displayWeather(weatherData);
            AlertManager.checkAlerts(weatherData); // Check for alerts

            // Fetch and display hourly forecast
            const hourlyForecast = await WeatherService.fetchHourlyForecast(locationInput);
            UIController.displayHourlyForecast(hourlyForecast);

        } catch (error) {
            alert("Could not fetch weather data. Please try again.");
        }
    } else {
        alert("Please enter a location");
    }
});

// Geolocation support
document.getElementById("current-location-button").addEventListener("click", async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const weatherData = await WeatherService.fetchWeatherByCoordinates(latitude, longitude);
                UIController.displayWeather(weatherData);
                AlertManager.checkAlerts(weatherData);

                // Fetch and display hourly forecast
                const hourlyForecast = await WeatherService.fetchHourlyForecast(`${latitude},${longitude}`);
                UIController.displayHourlyForecast(hourlyForecast);
            } catch (error) {
                alert("Could not fetch weather data for your current location. Please try again.");
            }
        }, (error) => {
            alert("Unable to retrieve your location. Please check your location settings.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
