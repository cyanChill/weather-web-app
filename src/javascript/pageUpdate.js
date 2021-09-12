import { getUnixTime } from "date-fns";

import toastModule from "./toast";
import { getWeatherInfoFor } from "./apiFetch";
import { isObject, filterData, reformateData } from "./utility";
import { fillCurrTemp, fillLocationInfo, setDailyWidgets, setHourlyWidgets } from "./domElements";

async function updatePageContents(locationName, config = { initialCall: false }) {
  try {
    const rtnedInfo = await compareWithCache(locationName, config);

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
  } catch (err) {
    console.log(err);
    toastModule.displayToast(err, "error");
    return undefined;
  }
}

async function compareWithCache(locationName, config) {
  // Cached data
  let cachedInfo;
  try {
    cachedInfo = JSON.parse(sessionStorage.getItem("cachedInfo"));
  } catch (e) {
    cachedInfo = "";
  }

  if (
    config.forceUpdate ||
    !cachedInfo ||
    (isObject(cachedInfo) && Object.keys(cachedInfo).length === 0) ||
    !cachedInfo.location ||
    !cachedInfo.currentWeather ||
    !cachedInfo.hourlyWeather ||
    !cachedInfo.dailyWeather ||
    getUnixTime(new Date()) - cachedInfo.currentWeather.dt > 10800000
  ) {
    console.log("Fetching new data");

    const recievedInfo = await getWeatherInfoFor(locationName, config);

    const filteredHourly = filterData(recievedInfo.hourlyWeather);
    const filteredDaily = filterData(recievedInfo.dailyWeather);

    return {
      location: recievedInfo.location,
      currentWeather: recievedInfo.currentWeather,
      filteredHourly,
      filteredDaily,
      formatedCurrent: reformateData(recievedInfo.currentWeather),
      formatedHourly: filteredHourly.map((data) => reformateData(data)),
      formatedDaily: filteredDaily.map((data) => reformateData(data)),
    };
  } else {
    console.log("Using Cached Data");

    return {
      location: cachedInfo.location,
      currentWeather: cachedInfo.currentWeather,
      filteredHourly: cachedInfo.hourlyWeather,
      filteredDaily: cachedInfo.dailyWeather,
      formatedCurrent: reformateData(cachedInfo.currentWeather),
      formatedHourly: cachedInfo.hourlyWeather.map((data) => reformateData(data)),
      formatedDaily: cachedInfo.dailyWeather.map((data) => reformateData(data)),
    };
  }
}

export { updatePageContents };
