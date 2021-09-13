import { getCorrectUnitFormat, toTitleCase } from "./utility";
import { createWeatherCard } from "./weatherCard";

const currTempSec = document.getElementById("curr-temp");
const currTempImg = currTempSec.querySelector(".weather-img");
const currTempField = currTempSec.querySelector(".temp");
const currTempDescription = currTempSec.querySelector(".weather-description");

/* Takes in a formated weather data object */
function fillCurrTemp(weatherObj) {
  const temp = getCorrectUnitFormat(weatherObj.currTemp, "temperature");
  const description = toTitleCase(weatherObj.weatherInfo.description);

  currTempImg.src = `images/${weatherObj.weatherInfo.icon}.png`;
  currTempImg.alt = `${description} weather image`;
  currTempField.textContent = temp;
  currTempDescription.textContent = description;
}

const locationInfoSec = document.getElementById("location-info");
const locationName = locationInfoSec.querySelector("#curr-location");
const rainChanceVal = locationInfoSec.querySelector("#chance-rain .value");
const humidityVal = locationInfoSec.querySelector("#humidity .value");
const windSpeedVal = locationInfoSec.querySelector("#wind-speed .value");
const visibilityVal = locationInfoSec.querySelector("#visibility .value");

/* Takes in a formated weather data object */
function fillLocationInfo(location, weatherObj) {
  const windSpeed = getCorrectUnitFormat(weatherObj.windSpeed, "wind-speed");
  const visibility = getCorrectUnitFormat(weatherObj.visibility, "visibility");

  locationName.textContent = toTitleCase(location);
  rainChanceVal.textContent = getCorrectUnitFormat(weatherObj.precipProb, "precipitation");
  humidityVal.textContent = `${weatherObj.humidity}%`;
  windSpeedVal.textContent = windSpeed;
  visibilityVal.textContent = visibility;
}

const hourlyWeatherSec = document.getElementById("hourly-weather");
const dailyWeatherSec = document.getElementById("daily-weather");

/* Takes in an array of formated weather data objects */
function setHourlyWidgets(weatherObjs) {
  const limitWidgets = weatherObjs.slice(0, 23);
  const widgets = getWidgets("hour", limitWidgets);
  hourlyWeatherSec.textContent = "";
  widgets.forEach((widget) => hourlyWeatherSec.appendChild(widget));
}

/* Takes in an array of formated weather data objects */
function setDailyWidgets(weatherObjs) {
  const widgets = getWidgets("day", weatherObjs);
  dailyWeatherSec.textContent = "";
  widgets.forEach((widget) => dailyWeatherSec.appendChild(widget));
}

function getWidgets(time, weatherObjs) {
  if (!Array.isArray(weatherObjs)) weatherObjs = [weatherObjs];
  return weatherObjs.map((weatherObj) => createWeatherCard(time, weatherObj));
}

export { fillCurrTemp, fillLocationInfo, setHourlyWidgets, setDailyWidgets };
