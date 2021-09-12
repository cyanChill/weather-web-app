import { isValidCity, getCoords, getLocationName } from "./utility";

const COORD_FETCH_URL_BASE = "https://api.openweathermap.org/data/2.5/weather?q=";
const URL_BASE = "https://api.openweathermap.org/data/2.5/onecall?";
const EXCLUDE = "minutely,alerts";
const API_KEY = process.env.API_KEY;

async function getCurrWeather(city) {
  try {
    const cityName = city.replace(/\s/g, "%20");
    const queryStr = `${COORD_FETCH_URL_BASE}${cityName}&appid=${API_KEY}`;

    const response = await fetch(queryStr);
    const data = await response.json();

    if (data.cod === "404") throw Error;

    return data;
  } catch (err) {
    throw "Invalid City";
  }
}

async function fetchWeather(lon, lat) {
  try {
    const queryStr = `${URL_BASE}lat=${lat}&lon=${lon}&exclude=${EXCLUDE}&units=imperial&appid=${API_KEY}`;

    const response = await fetch(queryStr);
    const data = await response.json();

    if (data.cod) throw Error;

    return { current: data.current, hourly: data.hourly, daily: data.daily };
  } catch (err) {
    throw "Failed To Fetch Weather Information";
  }
}

async function getWeatherInfoFor(cityName, config) {
  try {
    if (!isValidCity(cityName)) throw new Error("Invalid City");

    const currWeatherObj = await getCurrWeather(cityName);
    const { lon, lat } = getCoords(currWeatherObj);
    const locationName = getLocationName(currWeatherObj);

    if (!config.initialCall && locationName === localStorage.getItem("locationName")) {
      throw "Searching Weather For The Same Location";
    }

    const { current, hourly, daily } = await fetchWeather(lon, lat);

    return {
      location: locationName,
      currentWeather: current,
      hourlyWeather: hourly,
      dailyWeather: daily,
    };
  } catch (err) {
    throw err;
  }
}

export { getWeatherInfoFor };
