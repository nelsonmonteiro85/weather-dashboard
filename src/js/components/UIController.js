export default {
    displayWeather(data) {
        const temperatureElement = document.getElementById("temperature");
        const weatherIconElement = document.getElementById("weather-icon");
        const weatherDescriptionElement = document.getElementById("weather-description");
        const windStatusElement = document.getElementById("wind-status");
        const humidityElement = document.getElementById("humidity");

        // Update the elements with the fetched data
        temperatureElement.textContent = `${data.main.temp}°C`;
        weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherDescriptionElement.textContent = this.capitalizeDescription(data.weather[0].description);

        // Update additional info
        windStatusElement.textContent = `Wind: ${data.wind.speed} m/s`;
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    },

    clearWeather() {
        const temperatureElement = document.getElementById("temperature");
        const weatherIconElement = document.getElementById("weather-icon");
        const weatherDescriptionElement = document.getElementById("weather-description");
        const windStatusElement = document.getElementById("wind-status");
        const humidityElement = document.getElementById("humidity");

        // Clear the elements
        temperatureElement.textContent = "";
        weatherIconElement.src = "";
        weatherDescriptionElement.textContent = "";
        windStatusElement.textContent = "";
        humidityElement.textContent = "";
    },

    displayHourlyForecast(hourlyData) {
        const hourlyForecastList = document.getElementById("hourly-forecast-list");
        hourlyForecastList.innerHTML = ""; // Clear previous data

        if (hourlyData && hourlyData.length > 0) {
            hourlyData.forEach(hour => {
                const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const temperature = hour.main.temp;
                const listItem = document.createElement("li");
                listItem.textContent = `${time}: ${temperature}°C`;
                hourlyForecastList.appendChild(listItem);
            });
        } else {
            const errorItem = document.createElement("li");
            errorItem.textContent = "No hourly forecast available.";
            hourlyForecastList.appendChild(errorItem);
        }
    },

    capitalizeDescription(description) {
        return description.charAt(0).toUpperCase() + description.slice(1);
    },
};
