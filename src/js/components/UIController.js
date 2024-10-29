export default {
    displayWeather(data) {
        const temperatureElement = document.getElementById("temperature");
        const weatherIconElement = document.getElementById("weather-icon");
        const weatherDescriptionElement = document.getElementById("weather-description");
        const windStatusElement = document.getElementById("wind-status");
        const humidityElement = document.getElementById("humidity");
        const feelsLikeElement = document.getElementById("feels-like");
        const locationElement = document.getElementById("current-location");
        const dateElement = document.getElementById("current-date");

        if (data && data.main) {
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            weatherDescriptionElement.textContent = this.capitalizeDescription(data.weather[0].description);
            feelsLikeElement.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
            locationElement.textContent = data.name;
            windStatusElement.textContent = `🌬️ Wind: ${data.wind.speed} m/s`;
            humidityElement.textContent = `💧 Humidity: ${data.main.humidity}%`;
            dateElement.textContent = `Today, ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else {
            this.clearWeather();
            alert("Weather data is not available for this location.");
        }
    },

    displayAdditionalWeather(weatherAPIData) {
        const uvIndexElement = document.getElementById("uv-index");
        const dewPointElement = document.getElementById("dew-point");
        const aqiElement = document.getElementById("aqi");
        const sunriseSunsetElement = document.getElementById("sunrise-sunset");

        if (weatherAPIData && weatherAPIData.current) {
            // UV Index
            if (weatherAPIData.current.uv !== undefined) {
                uvIndexElement.textContent = `☀️ UV Index: ${weatherAPIData.current.uv}`;
            } else {
                uvIndexElement.textContent = "☀️ UV Index: N/A";
            }

            // Dew Point
            if (weatherAPIData.current.dewpoint_c !== undefined) {
                dewPointElement.textContent = `🌫️ Dew Point: ${Math.round(weatherAPIData.current.dewpoint_c)}°C`;
            } else {
                dewPointElement.textContent = "🌫️ Dew Point: N/A";
            }

            // Air Quality Index
            aqiElement.textContent = `🏭 Air Quality Index: ${weatherAPIData.current.air_quality?.["us-epa-index"] ?? "N/A"}`;

            // Sunrise and Sunset
            const sunrise = new Date(weatherAPIData.current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sunset = new Date(weatherAPIData.current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            sunriseSunsetElement.textContent = `🌅 Sunrise: ${sunrise}, Sunset: ${sunset}`;
        } else {
            console.error("No current weather data available.", weatherAPIData);
            this.clearAdditionalWeather();
        }
    },

    displayHourlyForecast(hourlyData) {
        const hourlyForecastList = document.getElementById("hourly-forecast-list");
        hourlyForecastList.innerHTML = "";

        if (hourlyData && hourlyData.length > 0) {
            hourlyData.slice(0, 12).forEach(hour => {
                const time = new Date(hour.time_epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const listItem = document.createElement("li");
                listItem.textContent = `${time}: ${Math.round(hour.temp_c)}°C, ${hour.condition.text}`;
                hourlyForecastList.appendChild(listItem);
            });
        } else {
            hourlyForecastList.innerHTML = "<li>No hourly forecast available.</li>";
        }
    },

    displayDailyForecast(forecastData) {
        const forecastList = document.getElementById("forecast-list");
        forecastList.innerHTML = "";

        if (forecastData && forecastData.forecastday) {
            forecastData.forecastday.forEach(day => {
                const listItem = document.createElement("li");
                listItem.classList.add("forecast-item");

                const dayOfWeek = new Date(day.date).toLocaleDateString([], { weekday: 'long' });
                const dateSpan = document.createElement("span");
                dateSpan.classList.add("date");
                dateSpan.textContent = dayOfWeek;

                const dayForecast = document.createElement("div");
                dayForecast.classList.add("day-forecast");

                const condition = document.createElement("p");
                condition.textContent = day.day.condition.text;

                const temperatures = document.createElement("p");
                temperatures.textContent = `High: ${Math.round(day.day.maxtemp_c)}°C Low: ${Math.round(day.day.mintemp_c)}°C`;

                dayForecast.appendChild(condition);
                dayForecast.appendChild(temperatures);
                listItem.appendChild(dateSpan);
                listItem.appendChild(dayForecast);

                forecastList.appendChild(listItem);
            });
        } else {
            forecastList.innerHTML = "<li>No daily forecast available.</li>";
        }
    },

    clearWeather() {
        document.getElementById("temperature").textContent = "";
        document.getElementById("weather-icon").src = "";
        document.getElementById("weather-description").textContent = "";
        document.getElementById("wind-status").textContent = "";
        document.getElementById("humidity").textContent = "";
        document.getElementById("feels-like").textContent = "";
        document.getElementById("current-location").textContent = "";
        document.getElementById("current-date").textContent = "";
        document.getElementById("uv-index").textContent = "";
        document.getElementById("dew-point").textContent = "";
        document.getElementById("aqi").textContent = "";
        document.getElementById("sunrise-sunset").textContent = "";
        document.getElementById("hourly-forecast-list").innerHTML = "";
        document.getElementById("forecast-list").innerHTML = "";
    },

    clearAdditionalWeather() {
        document.getElementById("uv-index").textContent = "";
        document.getElementById("dew-point").textContent = "";
        document.getElementById("aqi").textContent = "";
        document.getElementById("sunrise-sunset").textContent = "";
    },

    capitalizeDescription(description) {
        return description.charAt(0).toUpperCase() + description.slice(1);
    }
};
