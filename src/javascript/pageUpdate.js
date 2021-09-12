import { getUnixTime } from "date-fns";

import toastModule from "./toast";
import { getWeatherInfoFor } from "./apiFetch";
import { isObject, filterData, reformateData } from "./utility";
import { fillCurrTemp, fillLocationInfo, setDailyWidgets, setHourlyWidgets } from "./domElements";

async function updatePageContents(locationName, config) {
  const rtnedInfo = await compareWithCache(locationName);
  if (!rtnedInfo) return;

  const {
    location,
    currentWeather,
    filteredHourly,
    filteredDaily,
    formatedCurrent,
    formatedHourly,
    formatedDaily,
  } = rtnedInfo;

  fillCurrTemp(formatedCurrent);
  fillLocationInfo(location, formatedCurrent);

  setHourlyWidgets(formatedHourly);
  setDailyWidgets(formatedDaily);

  localStorage.setItem("locationName", location);

  if (!config.initialCall) {
    const msg = `Now displaying weather information for ${location}.`;
    toastModule.displayToast(msg, "success");
  }

  return {
    location,
    currentWeather,
    hourlyWeather: filteredHourly,
    dailyWeather: filteredDaily,
  };
}

async function compareWithCache(locationName) {
  // Cached data
  let cachedInfo;
  try {
    cachedInfo = JSON.parse(sessionStorage.getItem("cachedInfo"));
  } catch (e) {
    cachedInfo = "";
  }

  if (
    !cachedInfo ||
    (isObject(cachedInfo) && Object.keys(cachedInfo).length === 0) ||
    !cachedInfo.location ||
    !cachedInfo.currentWeather ||
    !cachedInfo.hourlyWeather ||
    !cachedInfo.dailyWeather ||
    getUnixTime(new Date()) - cachedInfo.currentWeather.dt > 10800000
  ) {
    const recievedInfo = await getWeatherInfoFor(locationName, { initialCall: true });

    if (!recievedInfo) throw "Missing Data";

    return {
      location: recievedInfo.location,
      currentWeather: recievedInfo.currentWeather,
      filteredHourly: filterData(recievedInfo.hourlyWeather),
      filteredDaily: filterData(recievedInfo.dailyWeather),
      formatedCurrent: reformateData(recievedInfo.currentWeather),
      formatedHourly: filteredHourly.map((data) => reformateData(data)),
      formatedDaily: filteredDaily.map((data) => reformateData(data)),
    };
  } else {
    return {
      location: cachedInfo.location,
      currentWeather: cachedInfo.currentWeather,
      filteredHourly: hourlyWeather,
      filteredDaily: dailyWeather,
      formatedCurrent: reformateData(cachedInfo.currentWeather),
      formatedHourly: hourlyWeather.map((data) => reformateData(data)),
      formatedDaily: dailyWeather.map((data) => reformateData(data)),
    };
  }
}

export { updatePageContents };
