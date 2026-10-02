import { fetchWeatherApi } from "openmeteo";

import sunny from "./assets/images/icon-sunny.webp";
import drizzle from "./assets/images/icon-drizzle.webp";
import fog from "./assets/images/icon-fog.webp";
import overcast from "./assets/images/icon-overcast.webp";
import partly from "./assets/images/icon-partly-cloudy.webp";
import rain from "./assets/images/icon-rain.webp";
import snow from "./assets/images/icon-snow.webp";
import storm from "./assets/images/icon-storm.webp";


const main = document.querySelector("main");
const header = document.querySelector("header");
const apiError = document.querySelector(".api-error");
const retryBtn = document.querySelector("#retry-btn");
const searchResultError = document.querySelector(".search-result-error");

header.classList.add("active");

let isMetric = true;
let isCelsius = true;
let isKMH = true;
let isMM = true;
let weatherData = null;
let retryAction = null;

const switchAllUnitsBtn = document.querySelector(".switch-units");
const unitButtons = document.querySelectorAll(".change-unit-btn");

unitButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!weatherData) return;

        if (button.id === "switchToCelcius") {
            isCelsius = true;
        } else if (button.id === "switchToFahrenheit") {
            isCelsius = false;
        } else if (button.id === "switchToKMH") {
            isKMH = true;
        } else if (button.id === "switchToMPH") {
            isKMH = false;
        } else if (button.id === "switchToMM") {
            isMM = true;
        } else if (button.id === "switchToIN") {
            isMM = false;
        }

        updateUI(weatherData);
    });
});


switchAllUnitsBtn.addEventListener("click", () => {
    if (!weatherData) return;

    if (isMetric) {
        isMetric = false;
        isCelsius = false;
        isKMH = false;
        isMM = false;
        switchAllUnitsBtn.textContent = "Switch to Metric"
    }
    else  {
        isMetric = true;
        isCelsius = true;
        isKMH = true;
        isMM = true;
        switchAllUnitsBtn.textContent = "Switch to Imperial"
    }
    updateUI(weatherData);
});

function convertTemperature(celsius) {
    return isCelsius
        ? celsius
        : (celsius * 9 / 5) + 32;
}

function convertSpeed(kmh) {
    return isKMH
        ? kmh
        : kmh * 0.621371;
}

function convertPrecipitation(mm) {
    return isMM
        ? mm
        : mm * 0.0393701;
}

let weekdayIndex = 0;

const dayChangeBtn = document.querySelector("#day-change-btn");
const dayDropdownCntr = document.querySelector(".day-dropdown-cntr");
const weekdayChangeBtn = document.querySelectorAll(".day-btn");

weekdayChangeBtn.forEach((weekdayBtn) => {
    weekdayBtn.addEventListener("click", () => {
        if (!weatherData) return;

        const selectedWeekday = weekdayBtn.textContent.trim();

        const dayOffset = weatherData.daily.time.findIndex(
            date =>
                date.toLocaleDateString("en-US", { weekday: "long" }) ===
                selectedWeekday
        );

        if (dayOffset === -1) return;

        weekdayIndex = 24 * dayOffset;
        dayChangeBtn.textContent = selectedWeekday;
        dayDropdownCntr.style.display = "none";

        updateUI(weatherData);
    });
});

const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {
    const dropdownBtn = dropdown.querySelector(".dropbtn");
    const dropDownCntr = dropdown.querySelector(".dropdown-cntr");
    dropdownBtn.addEventListener("click", () => {
        dropDownCntr.style.display =
            dropDownCntr.style.display === "flex" ? "none" : "flex";
    });
});

const searchBar = document.querySelector("#search-bar");
const searchResultsCntr = document.querySelector(".search-results-container");
const searchResultList = document.querySelector(".search-result-list");
const searchBtn = document.querySelector(".search-btn");

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

function formatLocationName({ name, admin1, country }) {
    const parts = [name];
    // if (admin1 && admin1 !== name) parts.push(admin1);
    if (country) parts.push(country);
    return parts.join(", ");
}

async function fetchCitySuggestions(query) {
    const response = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    const result = await response.json();
    return result.results || [];
}

function renderSearchResults(results) {
    searchResultList.innerHTML = "";

    if (results.length === 0) {
        searchResultsCntr.style.display = "none";
        return;
    }

    results.forEach((result) => {
        const li = document.createElement("li");
        li.className = "search-result";
        li.textContent = formatLocationName(result);
        li.dataset.lat = result.latitude;
        li.dataset.lon = result.longitude;
        searchResultList.appendChild(li);
    });

    searchResultsCntr.style.display = "block";
}

const debouncedSuggest = debounce(async (query) => {
    if (query.length < 2) {
        searchResultsCntr.style.display = "none";
        return;
    }

    try {
        const results = await fetchCitySuggestions(query);
        renderSearchResults(results);
    } catch (error) {
        console.error("Failed to fetch city suggestions:", error);
        searchResultsCntr.style.display = "none";
    }
}, 300);

searchBar.addEventListener("input", (event) => {
    debouncedSuggest(event.target.value.trim());

    const now = new Date();
    dayChangeBtn.textContent = now.toLocaleDateString("en-US", { weekday: "long" });
});

searchResultList.addEventListener("click", (event) => {
    const resultEl = event.target.closest(".search-result");
    if (!resultEl) return;

    selectSearchResult(
        parseFloat(resultEl.dataset.lat),
        parseFloat(resultEl.dataset.lon),
        resultEl.textContent.trim()
    );
});

async function selectSearchResult(latitude, longitude, label) {
    searchBar.value = label;
    searchResultsCntr.style.display = "none";
    retryAction = () => selectSearchResult(latitude, longitude, label);

    startNewRequest();

    const cached = getCachedWeather(label);
    if (cached) {
        weatherData = cached;
        updateUI(weatherData);
        return;
    }

    try {
        weatherData = await fetchWeatherData(latitude, longitude);
        setCachedWeather(label, weatherData);
        updateUI(weatherData);
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        showApiError();
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchBar.value.trim();
    if (!city) return;

    retryAction = () => getWeather(city);
    getWeather(city);
});

retryBtn.addEventListener("click", () => {
    if (retryAction) retryAction();
});


const WEATHER_ICONS = {
    clearSky: sunny,
    drizzle,
    fog,
    overcast,
    partly,
    rain,
    snow,
    storm
};

function getWeatherIcon(weatherCode) {
    switch (weatherCode) {
        case 0:
        case 1:
            return {
                url: WEATHER_ICONS.clearSky,
                alt: "Clear sky"
            };

        case 2:
            return {
                url: WEATHER_ICONS.partly,
                alt: "Partly cloudy"
            };

        case 3:
            return {
                url: WEATHER_ICONS.overcast,
                alt: "Overcast"
            };

        case 45:
        case 48:
            return {
                url: WEATHER_ICONS.fog,
                alt: "Foggy"
            };

        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            return {
                url: WEATHER_ICONS.drizzle,
                alt: "Drizzle"
            };

        case 61:
        case 63:
        case 65:
        case 80:
        case 81:
        case 82:
            return {
                url: WEATHER_ICONS.rain,
                alt: "Rainy"
            };

        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return {
                url: WEATHER_ICONS.snow,
                alt: "Snowy"
            };

        case 95:
        case 96:
        case 99:
            return {
                url: WEATHER_ICONS.storm,
                alt: "Thunderstorm"
            };

        default:
            return {
                url: WEATHER_ICONS.overcast,
                alt: "Overcast"
            };
    }
}

function updateUI(weatherData) {
    hideErrors();
    header.classList.add("active");
    main.classList.add("active");

    const cityContent = document.querySelector(".today-forecast-content");
    const loadingDisplay = document.querySelector(".loading-display");

    cityContent.style.display = "flex";
    loadingDisplay.style.display = "none";

    const cityName = document.querySelector("#location")
    const cityDate = document.querySelector("#date");
    const cityWeatherCode = document.querySelector("#curr-weather");
    const cityCurrTemp = document.querySelector("#curr-temp");
    const cityFeelsLike = document.querySelector("#feels-like-val");
    const cityHumidity = document.querySelector("#humidity-val");
    const cityPrecipitation = document.querySelector("#precipitation-val");
    const cityWindSpeed = document.querySelector("#wind-val");

    const currData = weatherData.current;
    const date = new Date(currData.time);

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "short" }) + ".";
    const day = date.getDate();
    const year = date.getFullYear();

    cityDate.textContent = `${weekday}, ${month} ${day} ${year}`;

    cityName.textContent = searchBar.value;

    cityWeatherCode.style.display = "block";
    const cityWeatherIcon = getWeatherIcon(currData.weather_code);
    cityWeatherCode.src = cityWeatherIcon.url;
    cityWeatherCode.alt = cityWeatherIcon.alt;

    cityHumidity.textContent = `${Math.round(currData.relative_humidity_2m)}%`;

    cityCurrTemp.textContent =
        `${Math.round(convertTemperature(currData.temperature_2m))}°`;

    cityFeelsLike.textContent =
        `${Math.round(convertTemperature(currData.apparent_temperature))}°`;

    cityWindSpeed.textContent =
        `${Math.round(convertSpeed(currData.wind_speed_10m))} ${isKMH ? "km/h" : "mph"}`;

    cityPrecipitation.textContent =
        `${Math.round(convertPrecipitation(currData.precipitation))} ${isMM ? "mm" : "in"}`;

    const dailyCntr = document.querySelectorAll(".weekday-cntr");
    const daily = weatherData.daily;

    dailyCntr.forEach((day, index) => {
        const dailyDate = new Date(daily.time[index]);
        const dailyWeekday = dailyDate.toLocaleDateString("en-US", { weekday: "short" });

        const weatherIcon = getWeatherIcon(daily.weather_code[index]);
        const dailyWeatherCodeURL = weatherIcon.url;
        const dailyWeatherCodeAlt = weatherIcon.alt;

        const maxTemp = Math.round(convertTemperature(daily.temperature_2m_max[index]));

        const minTemp = Math.round(convertTemperature(daily.temperature_2m_min[index]));

        day.innerHTML = `
            <p>${dailyWeekday}</p>
            <img src="${dailyWeatherCodeURL}" alt="${dailyWeatherCodeAlt}" />
            <div class="day-temp-cntr">
                <p class="max-temp">${maxTemp}˚</p>
                <p class="min-temp">${minTemp}˚</p>
            </div>
        `;
    });

    const hourly = weatherData.hourly;
    const hourlyList = document.querySelectorAll(".hourly-forecast-item");

    const currentHour = new Date(weatherData.current.time);
    currentHour.setMinutes(0, 0, 0);

    const foundIndex = hourly.time.findIndex(
        time => time.getTime() === currentHour.getTime()
    );
    const currentTimeIndex = foundIndex === -1 ? 0 : foundIndex;

    hourlyList.forEach((hourly_item, index) => {
        const hourlyIndex = currentTimeIndex + index + weekdayIndex + 1;

        const hourlyWeatherIcon = getWeatherIcon(
            hourly.weather_code[hourlyIndex]
        );

        const hourlyDate = new Date(hourly.time[hourlyIndex]);

        const hourlytime = hourlyDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        hourly_item.innerHTML = `
            <img
                src="${hourlyWeatherIcon.url}"
                alt="${hourlyWeatherIcon.alt}"
            />
            <p>${hourlytime}</p>
            <span>${Math.round(convertTemperature(hourly.temperature_2m[hourlyIndex]))}°</span>
        `;
    });

    document
        .querySelector("#switchToCelcius")
        .classList.toggle("active", isCelsius);

    document
        .querySelector("#switchToFahrenheit")
        .classList.toggle("active", !isCelsius);


    document
        .querySelector("#switchToKMH")
        .classList.toggle("active", isKMH);

    document
        .querySelector("#switchToMPH")
        .classList.toggle("active", !isKMH);


    document
        .querySelector("#switchToMM")
        .classList.toggle("active", isMM);

    document
        .querySelector("#switchToIN")
        .classList.toggle("active", !isMM);

}

function hideErrors() {
    apiError.classList.remove("active");
    searchResultError.classList.remove("active");
}

function showApiError() {
    header.classList.remove("active");
    main.classList.remove("active");
    apiError.classList.add("active");
}

function showNotFoundError() {
    main.classList.remove("active");
    searchResultError.classList.add("active");
}

function startNewRequest() {
    hideErrors();
    header.classList.add("active");
    main.classList.add("active");

    document.querySelector(".loading-display").style.display = "flex";
    document.querySelector(".today-forecast-content").style.display = "none";
}

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedWeather(city) {
    const entry = weatherCache.get(city.toLowerCase());
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        weatherCache.delete(city.toLowerCase());
        return null;
    }
    return entry.data;
}

function setCachedWeather(city, data) {
    weatherCache.set(city.toLowerCase(), { data, timestamp: Date.now() });
}

async function geocodeCity(city) {
    const response = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`
    );
    const result = await response.json();

    if (!result.results || result.results.length === 0) {
        const notFoundError = new Error(`No location found for "${city}"`);
        notFoundError.code = "NOT_FOUND";
        throw notFoundError;
    }

    const { latitude, longitude, name } = result.results[0];
    return { latitude, longitude, name };
}

async function fetchWeatherData(latitude, longitude) {
    const params = {
        latitude,
        longitude,
        daily: ["temperature_2m_min", "temperature_2m_max", "weather_code"],
        hourly: ["temperature_2m", "weather_code"],
        current: [
            "weather_code",
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation",
            "wind_speed_10m",
            "is_day"
        ]
    };

    const responses = await fetchWeatherApi(FORECAST_URL, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    if (!current || !hourly || !daily) {
        throw new Error("Weather data is unavailable.");
    }

    return {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            weather_code: current.variables(0).value(),
            temperature_2m: current.variables(1).value(),
            apparent_temperature: current.variables(2).value(),
            relative_humidity_2m: current.variables(3).value(),
            precipitation: current.variables(4).value(),
            wind_speed_10m: current.variables(5).value(),
            is_day: current.variables(6).value()
        },
        hourly: {
            time: Array.from(
                {
                    length:
                        (Number(hourly.timeEnd()) - Number(hourly.time())) /
                        hourly.interval()
                },
                (_, i) =>
                    new Date(
                        (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
                            1000
                    )
            ),
            temperature_2m: hourly.variables(0).valuesArray(),
            weather_code: hourly.variables(1).valuesArray()
        },
        daily: {
            time: Array.from(
                {
                    length:
                        (Number(daily.timeEnd()) - Number(daily.time())) /
                        daily.interval()
                },
                (_, i) =>
                    new Date(
                        (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                            1000
                    )
            ),
            temperature_2m_min: daily.variables(0).valuesArray(),
            temperature_2m_max: daily.variables(1).valuesArray(),
            weather_code: daily.variables(2).valuesArray()
        }
    };
}

async function getWeather(city) {
    startNewRequest();

    const cached = getCachedWeather(city);
    if (cached) {
        weatherData = cached;
        updateUI(weatherData);
        return;
    }

    try {
        const { latitude, longitude, name } = await geocodeCity(city);
        weatherData = await fetchWeatherData(latitude, longitude);

        setCachedWeather(city, weatherData);
        setCachedWeather(name, weatherData);
        updateUI(weatherData);
    } catch (error) {
        console.error("Failed to fetch weather:", error);

        if (error.code === "NOT_FOUND") {
            showNotFoundError();
        } else {
            showApiError();
        }
    }
}