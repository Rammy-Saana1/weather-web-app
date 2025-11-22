const API_KEY = "736463G22MEWJJU454KKEME78"; // your API key

document.getElementById("searchBtn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("locationInput").value.trim();
  if (city === "") return alert("Enter a city name.");

  const url =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.error) return alert("City not found");

    displayWeather(data);

  } catch (err) {
    alert("Error fetching weather.");
  }
}

function displayWeather(data) {
  const current = data.currentConditions;

  document.getElementById("weatherCard").classList.remove("hidden");
  document.getElementById("cityName").textContent = data.resolvedAddress;
  document.getElementById("temperature").textContent = Math.round(current.temp);
  document.getElementById("condition").textContent = current.conditions;
  document.getElementById("feelsLike").textContent = Math.round(current.feelslike);

  // TODAY'S WEATHER SUMMARY
  document.getElementById("todaySummary").textContent =
    createTodaySummary(current);

  // Friendly description
  document.getElementById("descriptionBox").textContent =
    createFriendlyDescription(current);

  buildHourly(data.days[0].hours);
  buildDaily(data.days);
}

/* TODAY'S WEATHER SUMMARY (SUNNY, RAINY, CLOUDY, ETC.) */

function createTodaySummary(c) {
  if (c.icon.includes("rain")) return "It is currently raining.";
  if (c.icon.includes("snow")) return "Snowfall is happening right now.";
  if (c.icon.includes("thunder")) return "Thunderstorms in the area.";
  if (c.icon.includes("fog")) return "Foggy conditions with low visibility.";
  if (c.icon.includes("cloud")) return "Cloudy skies with calm weather.";
  if (c.icon.includes("clear-day")) return "Sunny with clear blue skies.";
  if (c.icon.includes("clear-night")) return "Clear and calm night sky.";
  if (c.temp > 32) return "Very hot conditions outside.";
  if (c.temp < 5) return "Very cold weather right now.";

  return "Mild and pleasant weather today.";
}

/* FRIENDLY DESCRIPTION IN DETAIL */

function createFriendlyDescription(c) {
  if (c.precipprob > 70) return "Heavy rain expected. Carry an umbrella.";
  if (c.precipprob > 40) return "Moderate chance of rain today.";
  if (c.windspeed > 30) return "Strong winds today. Be cautious.";
  if (c.conditions.toLowerCase().includes("sun")) return "Bright and sunny day ahead.";
  if (c.conditions.toLowerCase().includes("cloud")) return "Cloudy but comfortable weather.";

  return "Weather looks normal and pleasant today.";
}

/* HOURLY FORECAST */

function buildHourly(hours) {
  const container = document.getElementById("hourlyContainer");
  container.innerHTML = "";

  hours.slice(0, 12).forEach(h => {
    const div = document.createElement("div");
    div.className = "hour";

    div.innerHTML = `
      <div class="hour-time">${h.datetime}</div>
      <i class="${getIcon(h.icon)}"></i>
      <div class="hour-temp">${Math.round(h.temp)}°</div>
    `;

    container.appendChild(div);
  });
}

/* DAILY FORECAST */

function buildDaily(days) {
  const container = document.getElementById("dailyContainer");
  container.innerHTML = "";

  days.slice(0, 7).forEach(day => {
    const div = document.createElement("div");
    div.className = "day-row";

    div.innerHTML = `
      <span class="day-name">${formatDay(day.datetime)}</span>
      <i class="${getIcon(day.icon)}"></i>
      <span class="temp-range">${Math.round(day.tempmin)}° / ${Math.round(day.tempmax)}°</span>
    `;

    container.appendChild(div);
  });
}

/* ICON MAPPING */

function getIcon(icon) {
  const map = {
    "rain": "wi wi-rain",
    "snow": "wi wi-snow",
    "fog": "wi wi-fog",
    "cloudy": "wi wi-cloudy",
    "partly-cloudy-day": "wi wi-day-cloudy",
    "partly-cloudy-night": "wi wi-night-clear",
    "clear-day": "wi wi-day-sunny",
    "clear-night": "wi wi-night-clear",
    "wind": "wi wi-strong-wind",
    "thunderstorm": "wi wi-thunderstorm"
  };

  return map[icon] || "wi wi-day-sunny";
}

/* FORMAT DAY NAME */

function formatDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
