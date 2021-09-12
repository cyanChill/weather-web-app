/* 
    Code to deal with the clock on the header bar
    - Automatically updates the clock in the header bar
    - Removes weather cards in the "Hourly" section once that hour has started
    - Refreshes all the data on the page every 3 hours
*/

import { format, getSeconds, getUnixTime, endOfHour } from "date-fns";
import { fillCurrTemp, fillLocationInfo } from "./domElements";
import { reformateData, updateSessionCache } from "./utility";

// We can only have 1 of each interval type going at once using this module
let clockInterval;
let updateInterval;
let hourlyInterval = {
  count: 0,
  interval: "",
};

const pageTimer = (function () {
  const clock = document.getElementById("curr-time");
  const hourlyWeatherInfo = document.getElementById("hourly-weather");

  function intialize() {
    clearAllIntervals();

    updateClock();
    calibrateClock();

    calibrateHourlyUpdate();
    triHourlyUpdate();
  }

  function clearAllIntervals() {
    clearInterval(clockInterval);
    clearInterval(updateInterval);
    clearInterval(hourlyInterval.interval);
  }

  function calibrateClock() {
    const delay = (60 - getSeconds(new Date())) * 1000;

    setTimeout(() => {
      updateClock();
      clockInterval = setInterval(updateClock, 60000);
    }, delay);
  }

  function updateClock() {
    clock.textContent = format(new Date(), "p");
  }

  function calibrateHourlyUpdate() {
    const delay = (getUnixTime(endOfHour(new Date())) - getUnixTime(new Date())) * 1000;

    setTimeout(() => {
      hourlyUpdate();
      hourlyInterval.interval = setInterval(hourlyUpdate, 3600000);
    }, delay);
  }

  function hourlyUpdate() {
    if (hourlyInterval.count % 3 < 2) {
      const recievedInfo = JSON.parse(sessionStorage.getItem("cachedInfo"));

      const currHourInfo = recievedInfo.hourlyWeather[0];
      const formatedData = reformateData(currHourInfo);

      fillCurrTemp(formatedData);
      fillLocationInfo(recievedInfo.location, formatedData);

      hourlyWeatherInfo.firstChild.remove();
      hourlyInterval.count++;

      recievedInfo.hourlyWeather.shift();
      updateSessionCache("cachedInfo", recievedInfo);
    } else {
      hourlyInterval.count = 0;
    }
  }

  function triHourlyUpdate() {
    updateInterval = setInterval(async () => {
      const location = localStorage.getItem("locationName");
      updatePageContents(location, { initialCall: true }).then((data) =>
        updateSessionCache("cachedInfo", data)
      );
    }, 10800000);
  }

  return { intialize };
})();

export default pageTimer;
