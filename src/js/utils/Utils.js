export function formatTemperature(temp) {
    return `${temp}°C`;
}

export function saveToLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}
