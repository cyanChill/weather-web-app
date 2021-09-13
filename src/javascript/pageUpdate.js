import { getUnixTime } from "date-fns";

import toastModule from "./toast";
import { getWeatherInfoFor } from "./apiFetch";
import { fillCurrTemp, fillLocationInfo, setDailyWidgets, setHourlyWidgets } from "./domElements";

async function updatePageContents(locationName, config = { initialCall: false }) {
  try {
    const rtnedInfo = await compareWithCache(locationName, config);

    if (!rtnedInfo) return;

    const { location, currentWeather, hourlyWeather, dailyWeather } = rtnedInfo;

    fillCurrTemp(currentWeather);
    fillLocationInfo(location, currentWeather);

    setHourlyWidgets(hourlyWeather);
    setDailyWidgets(dailyWeather);

    localStorage.setItem("locationName", location);

    if (!config.initialCall) {
      const msg = `Now displaying weather information for ${location}.`;
      toastModule.displayToast(msg, "success");
    }

    return {
      ...rtnedInfo,
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
    getUnixTime(new Date()) - cachedInfo.currentWeather.dt > 10800000
  ) {
    console.log("Fetching new data");

    const recievedInfo = await getWeatherInfoFor(locationName, config);

    return {
      ...recievedInfo,
    };
  } else {
    console.log("Using Cached Data");

    return {
      location: cachedInfo.location,
      currentWeather: cachedInfo.currentWeather,
      hourlyWeather: cachedInfo.hourlyWeather,
      dailyWeather: cachedInfo.dailyWeather,
    };
  }
}

export { updatePageContents };
