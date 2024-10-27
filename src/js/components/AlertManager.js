export default {
    setAlert(condition) {
        // Save alert condition in local storage or other mechanism
        localStorage.setItem("weatherAlert", JSON.stringify(condition));
    },

    checkAlerts(weatherData) {
        const alertCondition = JSON.parse(localStorage.getItem("weatherAlert"));
        if (alertCondition && this.shouldTriggerAlert(weatherData, alertCondition)) {
            alert(`Alert: ${alertCondition.message}`);
        }
    },

    shouldTriggerAlert(weatherData, alertCondition) {
        const currentTemp = weatherData.main.temp;
        return (
            (alertCondition.type === "temp_below" && currentTemp < alertCondition.value) ||
            (alertCondition.type === "temp_above" && currentTemp > alertCondition.value)
        );
    },
};