/* 
    Code to deal with the clock on the header bar
    - Automatically updates the clock in the header bar
    - Removes weather cards in the "Hourly" section once that hour has started
    - Refreshes all the data on the page every 3 hours
*/

import { format, getSeconds, getUnixTime, endOfHour, isToday, fromUnixTime } from "date-fns";
import { fillCurrTemp, fillLocationInfo } from "./domElements";
import { reformateData, updateSessionCache } from "./utility";
import { updatePageContents } from "./pageUpdate";

// We can only have 1 of each interval type going at once using this module
let clockInterval;
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
  }

  function clearAllIntervals() {
    clearInterval(clockInterval);
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
    const recievedInfo = JSON.parse(sessionStorage.getItem("cachedInfo"));

    const isNewDay = !isToday(new Date(fromUnixTime(recievedInfo.currentWeather.dt)));

    if (hourlyInterval.count % 3 < 2 && !isNewDay) {
      console.log("Hourly Update From Cache");

      const currHourInfo = recievedInfo.hourlyWeather[0];

      fillCurrTemp(currHourInfo);
      fillLocationInfo(localStorage.getItem("locationName"), currHourInfo);

      hourlyWeatherInfo.firstChild.remove();
      hourlyInterval.count++;

      recievedInfo.hourlyWeather.shift();
      updateSessionCache("cachedInfo", recievedInfo);
    } else if (isNewDay) {
      console.log("Updating Data For New Day");
      updateData();
    } else {
      console.log("Tri-Hourly Update From Servers");
      updateData();
    }

    function updateData() {
      hourlyInterval.count = 0;

      const location = localStorage.getItem("locationName");
      updatePageContents(location, { initialCall: true, forceUpdate: true }).then((data) =>
        updateSessionCache("cachedInfo", data)
      );
    }
  }

  return { intialize };
})();

export default pageTimer;
