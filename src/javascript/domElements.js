import { getCorrectUnitFormat, toTitleCase } from "./utility";
import { createWeatherCard } from "./weatherCard";

const currTempSec = document.getElementById("curr-temp");
const currTempImg = currTempSec.querySelector(".weather-img");
const currTempField = currTempSec.querySelector(".temp");
const currTempDescription = currTempSec.querySelector(".weather-description");

function fillCurrTemp(weatherObj) {
  /* Temp depends on whether we're in imperial or metric */
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

function fillLocationInfo(location, weatherObj) {
  /* windSpeed depend on whether we're in imperial or metric systems */
  const windSpeed = getCorrectUnitFormat(weatherObj.windSpeed, "wind-speed");
  /* Need to reduce visibility from meters/sec */
  const visibility = getCorrectUnitFormat(weatherObj.visibility, "visibility");

  locationName.textContent = toTitleCase(location);
  rainChanceVal.textContent = getCorrectUnitFormat(weatherObj.precipProb, "precipitation");
  humidityVal.textContent = `${weatherObj.humidity}%`;
  windSpeedVal.textContent = windSpeed;
  visibilityVal.textContent = visibility;
}

const hourlyWeatherSec = document.getElementById("hourly-weather");
const dailyWeatherSec = document.getElementById("daily-weather");

function setHourlyWidgets(weatherObjs) {
  const widgets = getWidgets("hour", weatherObjs);
  hourlyWeatherSec.textContent = "";
  widgets.forEach((widget) => hourlyWeatherSec.appendChild(widget));
}

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
