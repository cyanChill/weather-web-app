import { isValidCity, getCoords, getLocationName } from "./utility";

const COORD_FETCH_URL_BASE = "https://api.openweathermap.org/data/2.5/weather?q=";
const URL_BASE = "https://api.openweathermap.org/data/2.5/onecall?";
const EXCLUDE = "current,minutely,alerts";
/* Free API key */
const API_KEY = "4e9e9bd9d25c3c1ce6e7f62ea6284fc1";

const UNITS = "imperial" | "metric"; // fahrenheit or celsius

async function getCurrWeather(city) {
  try {
    const cityName = city.replace(/\s/g, "%20");
    const queryStr = `${COORD_FETCH_URL_BASE}${cityName}&appid=${API_KEY}`;

    const response = await fetch(queryStr);
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

async function fetchWeather(coords) {
  try {
    const [lon, lat] = coords;
    const queryStr = `${URL_BASE}lat=${lat}&lon=${lon}&exclude=${EXCLUDE}&units=${UNITS}&appid=${API_KEY}`;

    const response = await fetch(queryStr);
    const data = await response.json();

    return [data.hourly, data.daily];
  } catch (err) {
    console.log(err);
  }
}

async function getWeatherInfoFor(cityName) {
  try {
    if (!isValidCity(cityName)) throw new Error("Invalid City");

    const currWeatherObj = await getCurrWeather(cityName);
    const coords = getCoords(currWeatherObj);
    const locationName = getLocationName(currWeatherObj);

    const [daily, hourly] = await fetchWeather(coords);

    return {
      location: locationName,
      currentWeather: currWeatherObj,
      hourlyWeather: hourly,
      dailyWeather: daily,
    };
  } catch (err) {
    console.log(err);
  }
}

export { getWeatherInfoFor };
