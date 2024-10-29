const openWeatherApiKey = "5e2383d42104288b4745132157c02b09";
const weatherApiKey = "1b3fb7b8f142468e826222619242610";
const openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5";
const weatherApiBaseUrl = "https://api.weatherapi.com/v1";

export default {
    async fetchOpenWeather(location) {
        const apiUrl = `${openWeatherBaseUrl}/weather?q=${location}&appid=${openWeatherApiKey}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("OpenWeather data not found");
            return await response.json();
        } catch (error) {
            console.error("Error fetching OpenWeather data:", error);
            throw error;
        }
    },

    async fetchWeatherAPI(location) {
        // Using forecast endpoint instead of current to get both current and forecast data
        const apiUrl = `${weatherApiBaseUrl}/forecast.json?key=${weatherApiKey}&q=${location}&days=7&aqi=yes`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("WeatherAPI data not found");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching WeatherAPI data:", error);
            throw error;
        }
    },

    async fetchHourlyForecast(location) {
        // This can be removed as we're getting hourly data from WeatherAPI forecast endpoint
        const apiUrl = `${weatherApiBaseUrl}/forecast.json?key=${weatherApiKey}&q=${location}&days=1&aqi=yes`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Hourly forecast data not found");
            const data = await response.json();
            return data.forecast.forecastday[0].hour; // Return the hourly forecast for today
        } catch (error) {
            console.error("Error fetching hourly forecast:", error);
            throw error;
        }
    },

    async fetchWeatherByCoordinates(latitude, longitude) {
        const apiUrl = `${weatherApiBaseUrl}/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=7&aqi=yes`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Weather data by coordinates not found");
            return await response.json();
        } catch (error) {
            console.error("Error fetching weather by coordinates:", error);
            throw error;
        }
    }
};