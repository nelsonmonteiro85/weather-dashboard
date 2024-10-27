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
        const apiUrl = `${weatherApiBaseUrl}/current.json?key=${weatherApiKey}&q=${location}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("WeatherAPI data not found");
            const data = await response.json();
            console.log(data); // Inspect this to find AQI structure
            return data;
        } catch (error) {
            console.error("Error fetching WeatherAPI data:", error);
            throw error;
        }
    },

    async fetchHourlyForecast(location) {
        const apiUrl = `${openWeatherBaseUrl}/forecast?q=${location}&appid=${openWeatherApiKey}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Hourly forecast data not found");
            const data = await response.json();
            return data.list; // The hourly forecast is typically found in a list
        } catch (error) {
            console.error("Error fetching hourly forecast:", error);
            throw error;
        }
    }
};
