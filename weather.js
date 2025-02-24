const API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const API_KEY = "8JGP5F48XGA6J4CAJSWT9DFST"; // Your API Key

async function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `${API_URL}/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200 || !data.currentConditions) {
            document.getElementById("weather-info").innerHTML = `<p style="color:red;">City not found or API error!</p>`;
            return;
        }

        // Get weather details
        const condition = data.currentConditions.conditions;
        const temperature = data.currentConditions.temp;
        const humidity = data.currentConditions.humidity;
        const windSpeed = data.currentConditions.windspeed;

        // Create the weather HTML
        const weatherHTML = `
            <h2>${data.resolvedAddress}</h2>
            <p>${getWeatherIcon(condition)} ${condition}</p>
            <p>🌡️ Temperature: ${temperature}°C</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>🌬️ Wind Speed: ${windSpeed} km/h</p>
        `;

        document.getElementById("weather-info").innerHTML = weatherHTML;

        // Update background & sound effects
        updateBackground(condition);
        playWeatherSound(condition);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weather-info").innerHTML = `<p style="color:red;">Failed to fetch data. Check API key or internet connection.</p>`;
    }
}

// Function to update background based on weather condition
function updateBackground(condition) {
    const body = document.body;
    let imageUrl = "";

    if (condition.toLowerCase().includes("rain")) {
        imageUrl = "https://source.unsplash.com/1600x900/?rainy";
    } else if (condition.toLowerCase().includes("cloud")) {
        imageUrl = "https://source.unsplash.com/1600x900/?cloudy";
    } else if (condition.toLowerCase().includes("clear")) {
        imageUrl = "https://source.unsplash.com/1600x900/?sunny";
    } else if (condition.toLowerCase().includes("snow")) {
        imageUrl = "https://source.unsplash.com/1600x900/?snow";
    } else if (condition.toLowerCase().includes("thunder")) {
        imageUrl = "https://source.unsplash.com/1600x900/?thunderstorm";
    } else {
        imageUrl = "https://source.unsplash.com/1600x900/?nature";
    }

    // Preload the image to prevent flickering
    const img = new Image();
    img.src = imageUrl;
    img.onload = function () {
        body.style.transition = "background 1s ease-in-out";
        body.style.backgroundImage = `url('${imageUrl}')`;
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
    };
    img.onerror = function () {
        console.error("Failed to load image from Unsplash");
        // Fallback image in case of error
        body.style.backgroundImage = "url('path/to/fallback/image.jpg')";
    };
}


// Function to return weather emoji/icon
function getWeatherIcon(condition) {
    if (condition.includes("Rain")) return "🌧️";
    if (condition.includes("Cloud")) return "☁️";
    if (condition.includes("Clear")) return "☀️";
    if (condition.includes("Snow")) return "❄️";
    if (condition.includes("Thunder")) return "⛈️";
    return "🌍";
}

// Function to play background sound based on weather
function playWeatherSound(condition) {
    let sound = "";
    if (condition.includes("Rain")) sound = "rain.mp3";
    if (condition.includes("Thunder")) sound = "thunder.mp3";
    if (condition.includes("Clear")) sound = "birds.mp3";

    if (sound) {
        let audio = new Audio(`sounds/${sound}`);
        audio.play();
    }
}
